import OrderData from "../../domain/data/OrderData";
import Order from "../../domain/entities/Order";
import Connection from "../database/Connection";

export default class OrderDataDatabase implements OrderData {

	constructor (readonly connection: Connection) {
	}
	async getByCode(code: number): Promise<any> {
		const [order] = await this.connection.query("select * from cccat9.order where code = $1", [code]);
		return order;
	}
	async getAll(): Promise<any> {
		return await this.connection.query("select * from cccat9.order", null);
	}

	async save(order: Order): Promise<void> {
		await this.connection.query("insert into cccat9.order (cpf, total, code) values ($1, $2, $3)", 
		[order.cpf.getValue(), order.getTotal(), order.getCode()]);
	}

	async getByCpf(cpf: string): Promise<any> {
		const [orderData] = await this.connection.query("select * from cccat9.order where cpf = $1", [cpf]);
		return orderData;
	}

	async count(): Promise<number> {
		const [options] = await this.connection.query("select count(*)::integer as count from cccat9.order", []);
		return options.count;
	}
}
