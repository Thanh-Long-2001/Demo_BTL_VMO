export class CreateVoucherDTO {
    name: string;
    description: string;
    code: string;
    decreaseMoney: number;
    useforproductCost: number;
    numberOfVoucher: number;
    expireAt: string;
}