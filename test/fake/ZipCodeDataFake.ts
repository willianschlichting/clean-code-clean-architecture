import ZipCodeData from "../../src/domain/data/ZipCodeData";
import ZipCode from "../../src/domain/entities/ZipCode";

export default class ZipCodeDataFake implements ZipCodeData {
    async getByZipCode(code: string): Promise<ZipCode> {
        const zipCodes: { [zipCode: string]: ZipCode } = {
            '88015600': { code: '88015600', street: 'Rua Almirante Lamego', neighborhood: 'Centro', lat:-27.5945, long:-48.5477},
            '22060030': { code: '22060030', street: 'Rua Aires Saldanha', neighborhood: 'Copacabana', lat: -22.9129, long: -43.2003}
        }
        return zipCodes[code];
    }
}