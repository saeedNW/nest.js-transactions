import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WalletEntity } from "./entity/wallet.entity";
import { DataSource, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { DepositDro, WithdrawalDto } from "./dto/wallet.dto";
import { UserEntity } from "../user/entity/user.entity";
import { WalletTypes } from "./enums/wallet.enum";

@Injectable()
export class WalletService {
	constructor(
		@InjectRepository(WalletEntity)
		private walletRepository: Repository<WalletEntity>,
		private userService: UserService,
		private dataSource: DataSource
	) {}

	async deposit(depositDto: DepositDro) {
		/**
		 * ? Starts an isolated transaction using TypeORM's QueryRunner.
		 *
		 * Transactions ensure data consistency by grouping a sequence of database operations.
		 * The outcome of the transaction can result in two scenarios:
		 *
		 * 1. **Successful Completion:**
		 *    - All operations execute without errors, and the transaction is committed to the database.
		 *
		 * 2. **Error Occurrence:**
		 *    - If an error occurs during the process, the transaction is rolled back, ensuring that no partial changes are saved.
		 *
		 * **Usage Guidelines:**
		 * - To properly handle a transaction, wrap the operation logic within a `try/catch` block.
		 * - Use the `try` block to define operations that should be executed as part of the transaction.
		 * - In the `catch` block, ensure the rollback process is handled to revert changes in case of failure.
		 */
		const queryRunner = this.dataSource.createQueryRunner(); // Create an isolate database query runner
		await queryRunner.connect(); // Connect the query runner to database
		await queryRunner.startTransaction(); // Start a transaction

		try {
			const { amount, fullName, phone } = depositDto;

			/** Create or retrieve user'd data */
			const user = await this.userService.create({ fullName, phone });

			/** Use the query runner  to retrieve user's data in the isolated environment */
			const userDate = await queryRunner.manager.findOneBy(UserEntity, {
				id: user.id,
			});

			/** Calculate user's new balance amount */
			const newBalance = +userDate.balance + amount;
			/** update user data */
			await queryRunner.manager.update(
				UserEntity,
				{ id: userDate.id },
				{ balance: newBalance }
			);

			/** Save payment data */
			await queryRunner.manager.insert(WalletEntity, {
				type: WalletTypes.DEPOSIT,
				invoice_number: Date.now().toString(),
				amount,
				userId: userDate.id,
			});

			/** Commit the transaction */
			await queryRunner.commitTransaction();
		} catch (err) {
			/** Start transaction rollback process */
			await queryRunner.rollbackTransaction();
			console.log(err);
			throw new InternalServerErrorException(err.message);
		} finally {
			/**
			 * ? To finalize the transaction, whether it is committed or rolled back,
			 * ? we must release the QueryRunner instance.
			 * ? The `queryRunner.release()` method ensures that resources allocated for
			 * ? the transaction are properly cleaned up and returned to the connection pool.
			 *
			 * ? Always call `release` in a `finally` block to guarantee cleanup,
			 * ? regardless of whether the transaction was successful or failed.
			 */
			await queryRunner.release();
		}

		return { message: "Deposit process ended successfully" };
	}

	async withdrawal(withdrawalDto: WithdrawalDto) {
		const queryRunner = this.dataSource.createQueryRunner(); // Create an isolate database query runner
		await queryRunner.connect(); // Connect the query runner to database
		await queryRunner.startTransaction(); // Start a transaction

		try {
			const { amount, phone } = withdrawalDto;

			/** Create or retrieve user'd data */
			const user = await this.userService.getUserByPhone(phone);

			/** Use the query runner  to retrieve user's data in the isolated environment */
			const userDate = await queryRunner.manager.findOneBy(UserEntity, {
				id: user.id,
			});

			if (amount > +userDate.balance) {
				throw new BadRequestException("Insufficient assets");
			}

			/** Calculate user's new balance amount */
			const newBalance = +userDate.balance - amount;
			/** update user data */
			await queryRunner.manager.update(
				UserEntity,
				{ id: userDate.id },
				{ balance: newBalance }
			);

			/** Save payment data */
			await queryRunner.manager.insert(WalletEntity, {
				type: WalletTypes.WITHDRAWAL,
				invoice_number: Date.now().toString(),
				amount,
				userId: userDate.id,
			});

			/** Commit the transaction */
			await queryRunner.commitTransaction();
		} catch (err) {
			/** Start transaction rollback process */
			await queryRunner.rollbackTransaction();
			console.log(err);
			throw new InternalServerErrorException(err.message);
		} finally {
			await queryRunner.release();
		}

		return { message: "Withdrawal process ended successfully" };
	}
}
