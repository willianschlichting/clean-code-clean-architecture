import ZipCode from "../entities/ZipCode";

export default interface ZipCodeData{
    getByZipCode(code: string): Promise<ZipCode>;
}