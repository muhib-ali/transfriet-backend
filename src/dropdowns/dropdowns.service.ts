import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../entities/role.entity";
import { Module } from "../entities/module.entity";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse } from "../common/interfaces/api-response.interface";
import { Product } from "../entities/product.entity";
import { Tax } from "../entities/tax.entity";
import { Client } from "../entities/client.entity";
import { Category } from "../entities/category.entity";
import { Subcategory } from "../entities/subcategory.entity";

@Injectable()
export class DropdownsService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(Product) 
    private productRepository: Repository<Product>,
    @InjectRepository(Tax) 
    private taxRepository: Repository<Tax>,
    @InjectRepository(Client) 
    private clientRepository: Repository<Client>,
    @InjectRepository(Category) 
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  async getAllRoles(): Promise<ApiResponse<any>> {
    const roles = await this.roleRepository.find({
      where: { is_active: true },
      select: ["id", "title"],
      order: { title: "ASC" },
    });

    const rolesDropdown = roles.map((role) => ({
      label: role.title,
      value: role.id,
    }));

    return ResponseHelper.success(
      { rolesDropdown },
      "Roles dropdown data retrieved successfully",
      "Dropdowns"
    );
  }

  async getAllModules(): Promise<ApiResponse<any>> {
    const modules = await this.moduleRepository.find({
      where: { is_active: true },
      select: ["id", "title"],
      order: { title: "ASC" },
    });

    const modulesDropdown = modules.map((module) => ({
      label: module.title,
      value: module.id,
    }));

    return ResponseHelper.success(
      { modulesDropdown },
      "Modules dropdown data retrieved successfully",
      "Dropdowns"
    );
  }

   async getAllProducts(): Promise<ApiResponse<any>> {
    const rows = await this.productRepository.find({
      where: { is_active: true },
      select: ["id", "title", "price"], // ensure price is selected
      order: { title: "ASC" },
    });

    // Currency formatter (PKR). Zarurat par "en-US"/USD use kar sakte ho.
    const fmt = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

    const productsDropdown = rows.map(p => {
      const priceNumber = Number(p.price); // numeric(12,2) aayega to string bhi ho sakta; normalize
      return {
        label: `${p.title}`, // e.g., "iPhone — ₨489,999.99"
        value: p.id,
        price: priceNumber, // raw number for FE logic/sorting
      };
    });

    return ResponseHelper.success(
      { productsDropdown },
      "Products dropdown data retrieved successfully",
      "Dropdowns"
    );
  }
  

  async getAllTaxes(): Promise<ApiResponse<any>> {
    const rows = await this.taxRepository.find({
      where: { is_active: true },
      select: ["id", "title", "value"],
      order: { title: "ASC" },
    });
    // label as "GST (18%)" style
    const taxesDropdown = rows.map(t => ({ label: `${t.title} (${Number(t.value)}%)`, value: t.id, price: Number(t.value) }));
    return ResponseHelper.success({ taxesDropdown }, "Taxes dropdown data retrieved successfully", "Dropdowns");
  }

  async getAllClients(): Promise<ApiResponse<any>> {
    const rows = await this.clientRepository.find({
      where: { is_active: true },
      select: ["id", "name"],
      order: { name: "ASC" },
    });
    const clientsDropdown = rows.map(c => ({ label: c.name, value: c.id }));
    return ResponseHelper.success({ clientsDropdown }, "Clients dropdown data retrieved successfully", "Dropdowns");
  }

  async getAllCategories(): Promise<ApiResponse<any>> {
    const rows = await this.categoryRepository.find({
      where: { is_active: true },
      select: ["id", "title"],
      order: { title: "ASC" },
    });
    const categoriesDropdown = rows.map(c => ({ label: c.title, value: c.id }));
    return ResponseHelper.success({ categoriesDropdown }, "Categories dropdown data retrieved successfully", "Dropdowns");
  }

  async getAllSubcategories(): Promise<ApiResponse<any>> {
    const rows = await this.subcategoryRepository.find({
      where: { is_active: true },
      select: ["id", "title"],
      order: { title: "ASC" },
    });
    const subcategoriesDropdown = rows.map(s => ({ label: s.title, value: s.id }));
    return ResponseHelper.success({ subcategoriesDropdown }, "Subcategories dropdown data retrieved successfully", "Dropdowns");
  }

}
