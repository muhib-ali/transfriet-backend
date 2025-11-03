import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { Client } from "../entities/client.entity";

@NestModule({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
