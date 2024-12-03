import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions {
	return {
		type: "postgres",
		port: 5432,
		host: "localhost",
		username: "postgres",
		password: "root",
		database: "transaction",
		autoLoadEntities: false,
		synchronize: process.env?.NODE_ENV !== "production",
		entities: [
			"dist/**/**/**/*.entity{.ts,.js}",
			"dist/**/**/*.entity{.ts,.js}",
		],
	};
}
