import ProductData from "../../src/domain/data/ProductData";

export default class ProductDataFake implements ProductData {
    async getProduct (idProduct: number): Promise<any> {
        const products: { [idProduct: number]: any } = {
            1: { idProduct: 1, description: "A", price: 1000, width: 100, height: 30, length: 10, weight: 3, currency: "BRL"},
            2: { idProduct: 2, description: "B", price: 5000, width: 50, height: 50, length: 50, weight: 22, currency: "BRL"},
            3: { idProduct: 3, description: "C", price: 30, width: 10, height: 10, length: 10, weight: 0.9, currency: "BRL"},
            4: { idProduct: 4, description: "D", price: 100, width: 100, height: 30, length: 10, weight: 3, currency: "USD"},
        }
        return products[idProduct];
    }
}