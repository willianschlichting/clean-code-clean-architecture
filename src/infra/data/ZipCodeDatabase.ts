import ZipCodeData from "../../domain/data/ZipCodeData";
import ZipCode from "../../domain/entities/ZipCode";
import Connection from "../database/Connection";

export default class ZipCodeDatabase implements ZipCodeData {

    constructor(readonly connection: Connection) {

    }

    async getByZipCode(code: string): Promise<ZipCode> {
        const [result] = await this.connection.query("select * from cccat.zipcode where code = $1", [code]);
        return new ZipCode(result.code, result.street, result.neighborhood, result.lat, result.long);
    }

}