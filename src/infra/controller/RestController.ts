import Checkout from "../../application/Checkout";
import OrderData from "../../domain/data/OrderData";
import HttpServer from "../http/HttpServer";

export default class RestController {

	constructor (readonly httpServer: HttpServer, readonly checkout: Checkout, readonly orderData: OrderData) {
		httpServer.on("post", "/checkout", async function (params: any, body: any) {
			const output = await checkout.execute(body);
			return output;
		});
		httpServer.on("get", "/order/:code", async function (params: any) {
			const output = await orderData.getByCode(params.code);
			return output;
		});

		httpServer.on("get", "/order/", async function (params: any) {
			const output = await orderData.getAll();
			return output;
		});
	}
}