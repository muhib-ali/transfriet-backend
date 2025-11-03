import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubcategoriesController } from "./subcategories.controller";
import { SubcategoriesService } from "./subcategories.service";
import { Subcategory } from "../entities/subcategory.entity";

@NestModule({
  imports: [TypeOrmModule.forFeature([Subcategory])],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
  exports: [SubcategoriesService],
})
export class SubcategoriesModule {}
