import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [UserModule, WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
