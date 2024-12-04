import { Body, Controller, Post } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { DepositDro } from "./dto/wallet.dto";

@Controller("wallet")
export class WalletController {
	constructor(private readonly walletService: WalletService) {}

	@Post("deposit")
	deposit(@Body() depositDto: DepositDro) {
		return this.walletService.deposit(depositDto);
	}
}
