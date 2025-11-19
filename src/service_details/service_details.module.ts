import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceDetailsController } from "./service_details.controller";
import { ServiceDetailsService } from "./service_details.service";
import { ServiceDetail } from "../entities/service-detail.entity";

@NestModule({
  imports: [TypeOrmModule.forFeature([ServiceDetail])],
  controllers: [ServiceDetailsController],
  providers: [ServiceDetailsService],
  exports: [ServiceDetailsService],
})
export class ServiceDetailsModule {}
