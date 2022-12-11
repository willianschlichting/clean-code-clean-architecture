import CouponData from "../../src/domain/data/CouponData";

export default class CouponDataFake implements CouponData {
    async getCoupon (code: string): Promise<any> {
        const coupons: any = {
            "VALE20": { code: "VALE20", percentage: 20, expire_date: new Date("2022-12-01T10:00:00")},
            "VALE20_EXPIRED": { code: "VALE20_EXPIRED", percentage: 20, expire_date: new Date("2022-10-01T10:00:00")}
        }
        return coupons[code];
    }
}