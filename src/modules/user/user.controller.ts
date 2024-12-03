import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user.dto";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	/**
	 * process of creating new user
	 * @param {CreateUserDto} createUserDto - new user's data
	 */
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	/**
	 * Retrieve single user data with id number
	 * @param {number} id - User id number
	 */
	@Get("/:id")
	getUserById(@Param("id", ParseIntPipe) id: number) {
		return this.userService.getUserById(id);
	}
}
