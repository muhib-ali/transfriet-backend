import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Product } from "../entities/product.entity";
import { ProductTranslation } from "../entities/product-translation.entity";


@NestModule({
  imports: [TypeOrmModule.forFeature([Product, ProductTranslation])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
