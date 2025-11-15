import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { Module } from "../entities/module.entity";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { DeletePermissionDto } from "./dto/delete-permission.dto";
import { PermissionFilterDto } from "./dto/permission-filter.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import {
  ApiResponse,
  PaginatedApiResponse,
} from "../common/interfaces/api-response.interface";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
    loggedInUserId: string
  ): Promise<ApiResponse<Permission>> {
    const { moduleId, title, slug, description } = createPermissionDto;

    // Check if module exists
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
    });

    if (!module) {
      throw new BadRequestException("Module not found");
    }

    // Check if permission with same slug already exists in this module
    const existingPermission = await this.permissionRepository.findOne({
      where: { slug, module_id: moduleId },
    });

    if (existingPermission) {
      throw new BadRequestException(
        "Permission with this slug already exists in this module"
      );
    }

    const permission = this.permissionRepository.create({
      module_id: moduleId,
      title,
      slug,
      description,
      created_by: loggedInUserId,
      updated_by: loggedInUserId,
    });

    const savedPermission = await this.permissionRepository.save(permission);

    // Get permission with module for response
    const permissionWithModule = await this.permissionRepository.findOne({
      where: { id: savedPermission.id },
      relations: ["module"],
    });

    return ResponseHelper.success(
      permissionWithModule!,
      "Permission created successfully",
      "Permission",
      201
    );
  }

  async update(
    updatePermissionDto: UpdatePermissionDto,
    loggedInUserId: string
  ): Promise<ApiResponse<Permission>> {
    const { id, moduleId, title, slug, description } = updatePermissionDto;

    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ["module"],
    });

    if (!permission) {
      throw new NotFoundException("Permission not found");
    }

    // Check if module exists
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
    });

    if (!module) {
      throw new BadRequestException("Module not found");
    }

    // Check if another permission with same slug exists in this module (excluding current permission)
    const existingPermission = await this.permissionRepository.findOne({
      where: { slug, module_id: moduleId },
    });

    if (existingPermission && existingPermission.id !== id) {
      throw new BadRequestException(
        "Permission with this slug already exists in this module"
      );
    }

    // Prepare update data
    const updateData = {
      module_id: moduleId,
      title,
      slug,
      description,
      updated_by: loggedInUserId,
    };

    await this.permissionRepository.update(id, updateData);

    const updatedPermission = await this.permissionRepository.findOne({
      where: { id },
      relations: ["module"],
    });

    return ResponseHelper.success(
      updatedPermission!,
      "Permission updated successfully",
      "Permission",
      200
    );
  }

  async getById(id: string): Promise<ApiResponse<Permission>> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ["module"],
    });

    if (!permission) {
      throw new NotFoundException("Permission not found");
    }

    return ResponseHelper.success(
      permission,
      "Permission retrieved successfully",
      "Permission",
      200
    );
  }

  async getAll(filterDto: PermissionFilterDto): Promise<PaginatedApiResponse<Permission>> {
    const { page = 1, limit = 10, moduleId, search } = filterDto;
    const skip = (page - 1) * limit;

    const qb = this.permissionRepository.createQueryBuilder("permission")
      .leftJoinAndSelect("permission.module", "module")
      .orderBy("permission.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (moduleId) {
      qb.andWhere("permission.module_id = :moduleId", { moduleId });
    }

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      qb.andWhere(new Brackets((sub) => {
        sub.where("permission.title ILIKE :search", { search: term })
          .orWhere("permission.slug ILIKE :search", { search: term })
          .orWhere("permission.description ILIKE :search", { search: term })
          .orWhere("module.title ILIKE :search", { search: term })
          .orWhere("module.slug ILIKE :search", { search: term })
          .orWhere("module.description ILIKE :search", { search: term });
      }));
    }

    const [permissions, total] = await qb.getManyAndCount();

    const message = moduleId
      ? "Permissions filtered by module retrieved successfully"
      : "Permissions retrieved successfully";

    return ResponseHelper.paginated(
      permissions,
      page,
      limit,
      total,
      "permissions",
      message,
      "Permission"
    );
  }

  async delete(
    deletePermissionDto: DeletePermissionDto
  ): Promise<ApiResponse<null>> {
    const { id } = deletePermissionDto;

    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException("Permission not found");
    }

    await this.permissionRepository.remove(permission);

    return ResponseHelper.success(
      null,
      "Permission deleted successfully",
      "Permission",
      200
    );
  }
}
