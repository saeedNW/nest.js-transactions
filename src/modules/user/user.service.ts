import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	) {}

	/**
	 * process of creating new user
	 * @param {CreateUserDto} createUserDto - new user's data
	 */
	async create(createUserDto: CreateUserDto) {
		const { phone } = createUserDto;

		let user = await this.userRepository.findOneBy({ phone });

		if (!user) {
			user = this.userRepository.create(createUserDto);
			return await this.userRepository.save(user);
		}

		return user;
	}

	/**
	 * Retrieve single user data with id number
	 * @param {number} id - User id number
	 */
	async getUserById(id: number) {
		const user = await this.userRepository.findOneBy({ id });

		if (!user) {
			throw new NotFoundException("The user was not found");
		}

		return user;
	}
}
