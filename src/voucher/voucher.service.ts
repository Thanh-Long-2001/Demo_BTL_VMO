import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Voucher, VoucherDocument } from './schemas/voucher.schema';
import { CreateVoucherDTO } from './dtos/voucher.dto';

@Injectable()
export class VoucherService {
    constructor(@InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument> ) {}

    async createVoucher(voucherDto: CreateVoucherDTO): Promise<Voucher> {
        const newVoucher = new this.voucherModel(voucherDto);
        return newVoucher.save();
    }   

    async findAllVouchers(): Promise<Voucher[]> {
        return await this.voucherModel.find().exec();
    }

    async fineOneVoucher(id: string): Promise<Voucher> {
        return await this.voucherModel.findById(id).exec();
    }

    async updateVoucher(id: string, voucherDto: CreateVoucherDTO): Promise<Voucher> {
        const updatedVoucher = await this.voucherModel.findByIdAndUpdate(id, {...voucherDto}).exec();
        return updatedVoucher;
    }

    async deleleVoucher(id: string) : Promise<any> { 
        return await this.voucherModel.findByIdAndDelete(id).exec();
    }

    async updateVoucherAfterGetVoucherToUser(id: string, numberOfVoucher: number) : Promise<Voucher> {
        return await this.voucherModel.findByIdAndUpdate(id, {numberOfVoucher: numberOfVoucher}).exec();
    }
}
