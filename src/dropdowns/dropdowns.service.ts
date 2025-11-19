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
import { JobFile } from "../entities/job-file.entity";
import { ServiceDetail } from "../entities/service-detail.entity";

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
    @InjectRepository(JobFile) 
    private jobFileRepository: Repository<JobFile>,
    @InjectRepository(ServiceDetail)
    private serviceDetailRepository: Repository<ServiceDetail>,
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
      relations: ["translations"],
      order: { created_at: "DESC" }, // ya agar chaho to koi aur order use kar sakte ho
    });

    const productsDropdown = rows.map((p) => {
      const en = p.translations?.find((t) => t.language_code === "en");
      const ar = p.translations?.find((t) => t.language_code === "ar");

      const priceNumber = Number(p.price);

      return {
        label: en?.title ?? ar?.title ?? "",      // default label, mostly English
        labelAr: ar?.title ?? undefined,          // optional Arabic label
        value: p.id,
        price: priceNumber,                       // raw number for FE
      };
    });

    return ResponseHelper.success(
      { productsDropdown },
      "Products dropdown data retrieved successfully",
      "Dropdowns",
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

  async getAllJobFiles(): Promise<ApiResponse<any>> {
    const rows = await this.jobFileRepository.find({
      where: { is_active: true },
      select: ["id", "title"],
      order: { title: "ASC" },
    });
    const jobFilesDropdown = rows.map(c => ({ label: c.title, value: c.id }));
    return ResponseHelper.success({ jobFilesDropdown }, "Job files dropdown data retrieved successfully", "Dropdowns");
  }

  async getAllServiceDetails(): Promise<ApiResponse<any>> {
    const rows = await this.serviceDetailRepository.find({
      where: { is_active: true },
      select: ["id", "title"],
      order: { title: "ASC" },
    });
    const serviceDetailsDropdown = rows.map(s => ({ label: s.title, value: s.id }));
    return ResponseHelper.success({ serviceDetailsDropdown }, "Service details dropdown data retrieved successfully", "Dropdowns");
  }

}
