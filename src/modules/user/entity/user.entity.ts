import { WalletEntity } from "src/modules/wallet/entity/wallet.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity("user")
export class UserEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;
	@Column()
	fullName: string;
	@Column()
	phone: string;
	@Column({ type: "numeric", default: 0 })
	balance: number;
	@OneToMany(() => WalletEntity, (wallet) => wallet.user)
	transactions: WalletEntity[];
	@CreateDateColumn()
	created_at: Date;
}
