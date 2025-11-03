import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DropdownsController } from "./dropdowns.controller";
import { DropdownsService } from "./dropdowns.service";
import { Role } from "../entities/role.entity";
import { Module as ModuleEntity } from "../entities/module.entity";
import { AuthModule } from "../auth/auth.module";
import { Product } from "../entities/product.entity";
import { Tax } from "../entities/tax.entity";
import { Client } from "../entities/client.entity";
import { Category } from "../entities/category.entity";
import { Subcategory } from "../entities/subcategory.entity";
// import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([
    Role,
    ModuleEntity, 
    Product,
    Tax,
    Client,
    Category,
    Subcategory,]), AuthModule],
  controllers: [DropdownsController],
  providers: [DropdownsService],
  exports: [DropdownsService],
})
export class DropdownsModule {}
