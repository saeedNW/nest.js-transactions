import {
	IsNotEmpty,
	IsNumber,
	IsString,
} from "class-validator";

export class DepositDro {
	@IsString()
	@IsNotEmpty()
	phone: string;
	@IsString()
	@IsNotEmpty()
	fullName: string;
	@IsNumber()
	@IsNotEmpty()
	amount: number;
}


export class WithdrawalDto {
	@IsString()
	@IsNotEmpty()
	phone: string;

	@IsNumber()
	@IsNotEmpty()
	amount: number;
}