import OrderData from "../../src/domain/data/OrderData";
import Order from "../../src/domain/entities/Order";

export default class OrderDataFake implements OrderData{
    async save(order: Order): Promise<void> {
    }
    async getByCpf(cpf: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async count(): Promise<number> {
        return 0;
    }
    async getByCode(code: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getAll(): Promise<any> {
        throw new Error("Method not implemented.");
    }

}