import Coupon from "../domain/entities/Coupon";
import CouponData from "../domain/data/CouponData";
import { validate } from "../domain/entities/CpfValidator";
import CurrencyGatewayRandom from "../infra/gateway/CurrencyGatewayRandom";
import CurrencyGateway from "../infra/gateway/CurrencyGatewayRandom";
import FreightCalculator from "../domain/entities/FreightCalculator";
import Mailer from "../infra/mailer/Mailer";
import MailerConsole from "../infra/mailer/MailerConsole";
import Order from "../domain/entities/Order";
import OrderCode from "../domain/entities/OrderCode";
import OrderData from "../domain/data/OrderData";
import ProductData from "../domain/data/ProductData";
import DistanceCalculator from "../DistanceCalculator";
import ZipCodeData from "../domain/data/ZipCodeData";
import ZipCode from "../domain/entities/ZipCode";
import Coord from "../Coord";

export default class Checkout {

	constructor (
		readonly productData: ProductData, 
		readonly couponData: CouponData,
		readonly orderData: OrderData,
		readonly zipCodeData: ZipCodeData,
		readonly currencyGateway: CurrencyGateway = new CurrencyGatewayRandom(),
		readonly mailer: Mailer = new MailerConsole()
	) {
	}

	async execute (input: Input) {
		const currencies = await this.currencyGateway.getCurrencies();
		const sequence: number = await this.orderData.count();
		const order = new Order(input.cpf, new Date(), sequence + 1);
		if (input.zipCode) {
			const origin: ZipCode = await this.zipCodeData.getByZipCode('22060030');
			const dest: ZipCode = await this.zipCodeData.getByZipCode(input.zipCode);
			if (dest) {
				const distance = DistanceCalculator.calculate(new Coord(origin.lat, origin.long), new Coord(dest.lat, dest.long));
				order.distance = distance;
			}
		} else {
			order.distance = 1000;
		}
		for (const item of input.items) {
			const product = await this.productData.getProduct(item.idProduct);
			order.addItem(product, item.quantity, product.currency, currencies.getCurrency(product.currency), order.distance);
		}
		if (input.coupon) {
			const coupon = await this.couponData.getCoupon(input.coupon);
			order.addCoupon(coupon);
		}
		await this.orderData.save(order);
		return {
			code: order.getCode(),
			total: order.getTotal(),
			shipping: {freight: order.freight, distance: order.distance}
		};
	}
}


type Input = {
	cpf: string,
	email?: string,
	items: { idProduct: number, quantity: number }[],
	coupon?: string,
	zipCode?: string
};
