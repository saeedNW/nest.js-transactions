import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { WalletTypes } from "../enums/wallet.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity("wallet")
export class WalletEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;
	@Column({ type: "enum", enum: WalletTypes })
	type: string;
	@Column()
	invoice_number: string;
	@Column({ nullable: true })
	userId: number;
	@ManyToOne(() => UserEntity, (user) => user.transactions, {
		onDelete: "SET NULL",
	})
	user: UserEntity;
	@CreateDateColumn()
	created_at: Date;
}
