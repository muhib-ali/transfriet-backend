import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DeleteUserDto } from "./dto/delete-user.dto";
import { UserListQueryDto } from "./dto/user-list-query.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import {
  ApiResponse,
  PaginatedApiResponse,
} from "../common/interfaces/api-response.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async create(
    createUserDto: CreateUserDto,
    loggedInUserId: string
  ): Promise<ApiResponse<User>> {
    const { name, email, roleId, password } = createUserDto;

    // Check if user with same email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException("Role not found");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.userRepository.create({
      name,
      email,
      role_id: roleId,
      password: hashedPassword,
      created_by: loggedInUserId,
      updated_by: loggedInUserId,
    });

    const savedUser = await this.userRepository.save(user);

    // Get user with role for response
    const userWithRole = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ["role"],
    });

    return ResponseHelper.success(
      userWithRole!,
      "User created successfully",
      "User",
      201
    );
  }

  async update(
    updateUserDto: UpdateUserDto,
    loggedInUserId: string
  ): Promise<ApiResponse<User>> {
    const { id, name, email, roleId, password } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["role"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if another user with same email exists (excluding current user)
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException("User with this email already exists");
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException("Role not found");
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
      role_id: roleId,
      updated_by: loggedInUserId,
    };

    // Hash password if provided
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    await this.userRepository.update(id, updateData);

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ["role"],
    });

    return ResponseHelper.success(
      updatedUser!,
      "User updated successfully",
      "User",
      200
    );
  }

  async getById(id: string): Promise<ApiResponse<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["role"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return ResponseHelper.success(
      userWithoutPassword as any,
      "User retrieved successfully",
      "User",
      200
    );
  }

  async getAll(query: UserListQueryDto): Promise<PaginatedApiResponse<Omit<User, "password">>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .orderBy("user.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      qb.andWhere(new Brackets((sub) => {
        sub.where("user.name ILIKE :search", { search: term })
          .orWhere("user.email ILIKE :search", { search: term })
          .orWhere("role.title ILIKE :search", { search: term })
          .orWhere("role.slug ILIKE :search", { search: term });
      }));
    }

    const [users, total] = await qb.getManyAndCount();

    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user as any;
      return userWithoutPassword;
    });

    return ResponseHelper.paginated(
      usersWithoutPasswords as any,
      page,
      limit,
      total,
      "users",
      "Users retrieved successfully",
      "User"
    );
  }

  async delete(deleteUserDto: DeleteUserDto): Promise<ApiResponse<null>> {
    const { id } = deleteUserDto;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.userRepository.remove(user);

    return ResponseHelper.success(
      null,
      "User deleted successfully",
      "User",
      200
    );
  }
}
