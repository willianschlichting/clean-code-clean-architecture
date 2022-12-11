import Checkout from "../src/application/Checkout";
import sinon from "sinon";
import CurrencyGateway from "../src/infra/gateway/CurrencyGatewayRandom";
import MailerConsole from "../src/infra/mailer/MailerConsole";
import Mailer from "../src/infra/mailer/Mailer";
import Currencies from "../src/domain/entities/Currencies";
import ProductDataFake from "./fake/ProductDataFake";
import CouponDataFake from "./fake/CouponDataFake";
import OrderDataFake from "./fake/OrderDataFake";
import ZipCodeDataFake from "./fake/ZipCodeDataFake";

test("Deve fazer um pedido com 3 produtos", async function () {
	const input = {
		cpf: "987.654.321-00",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 }
		]
	};
	
	const checkout = new Checkout(new ProductDataFake(), new CouponDataFake(), new OrderDataFake(), new ZipCodeDataFake());
	const output = await checkout.execute(input);
	expect(output.total).toBe(6350);
});

test("Deve fazer um pedido com 4 produtos com moedas diferentes", async function () {
	const currencies = new Currencies();
	currencies.addCurrency("USD", 2);
	currencies.addCurrency("BRL", 1);
	const currencyGatewayStub = sinon.stub(CurrencyGateway.prototype, "getCurrencies").resolves(currencies);
	const mailerSpy = sinon.spy(MailerConsole.prototype, "send");
	const input = {
		cpf: "987.654.321-00",
		email: "rodrigo@branas.io",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 },
			{ idProduct: 4, quantity: 1 }
		]
	};
	
	const checkout = new Checkout(new ProductDataFake(), new CouponDataFake(), new OrderDataFake(), new ZipCodeDataFake());
	const output = await checkout.execute(input);
	expect(output.total).toBe(6580);
	// expect(mailerSpy.calledOnce).toBeTruthy();
	// expect(mailerSpy.calledWith("rodrigo@branas.io", "Checkout Success", "ABCDEF")).toBeTruthy();
	currencyGatewayStub.restore();
	mailerSpy.restore();
});

test("Deve fazer um pedido com 4 produtos com moedas diferentes com mock", async function () {
	const currencies = new Currencies();
	currencies.addCurrency("USD", 2);
	currencies.addCurrency("BRL", 1);
	const currencyGatewayMock = sinon.mock(CurrencyGateway.prototype)
	currencyGatewayMock.expects("getCurrencies")
		.once()
		.resolves(currencies);
	// const mailerMock = sinon.mock(MailerConsole.prototype);
	// mailerMock.expects("send")
	// 	.once()
	// 	.withArgs("rodrigo@branas.io", "Checkout Success", "ABCDEF");
	const input = {
		cpf: "987.654.321-00",
		email: "rodrigo@branas.io",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 },
			{ idProduct: 4, quantity: 1 }
		]
	};
	const checkout = new Checkout(new ProductDataFake(), new CouponDataFake(), new OrderDataFake(), new ZipCodeDataFake());
	const output = await checkout.execute(input);
	expect(output.total).toBe(6580);
	// mailerMock.verify();
	// mailerMock.restore();
	currencyGatewayMock.verify();
	currencyGatewayMock.restore();
});

test("Deve fazer um pedido com 4 produtos com moedas diferentes com fake", async function () {
	const input = {
		cpf: "987.654.321-00",
		email: "rodrigo@branas.io",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 },
			{ idProduct: 4, quantity: 1 }
		]
	};
	const currencies = new Currencies();
	currencies.addCurrency("USD", 2);
	currencies.addCurrency("BRL", 1);
	const currencyGateway: CurrencyGateway = {
		async getCurrencies(): Promise<any> {
			return currencies;
		}
	}
	const log: { to: string, subject: string, message: string }[] = [];
	const mailer: Mailer = {
		async send (to: string, subject: string, message: string): Promise<any> {
			log.push({ to, subject, message });
		}
	}
	const checkout = new Checkout(new ProductDataFake(), new CouponDataFake(), new OrderDataFake(), new ZipCodeDataFake(), currencyGateway, mailer);
	const output = await checkout.execute(input);
	expect(output.total).toBe(6580);
	// expect(log).toHaveLength(1);
	// expect(log[0].to).toBe("rodrigo@branas.io");
	// expect(log[0].subject).toBe("Checkout Success");
	// expect(log[0].message).toBe("ABCDEF");
});

test("Deve fazer um pedido com 3 produtos com código do pedido", async function () {
	const input = {
		cpf: "987.654.321-00",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 }
		]
	};
	const checkout = new Checkout(new ProductDataFake(), new CouponDataFake(), new OrderDataFake(), new ZipCodeDataFake());
	const output = await checkout.execute(input);
	expect(output.code).toBe("202200000001");
});

test("Deve fazer um pedido calculando a distancia e o frete", async function () {
	const input = {
		cpf: "987.654.321-00",
		items: [
			{ idProduct: 1, quantity: 1 },
			{ idProduct: 2, quantity: 1 },
			{ idProduct: 3, quantity: 3 }
		],
		zipCode: '88015600'
	};
	const checkout = new Checkout(new ProductDataFake(), new CouponDataFake(), new OrderDataFake(), new ZipCodeDataFake());
	const output: any = await checkout.execute(input);
	expect(output.shipping.distance).toBe(748.2217780081631);
});
