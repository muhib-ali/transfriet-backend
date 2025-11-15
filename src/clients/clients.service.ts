import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "../entities/client.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { DeleteClientDto } from "./dto/delete-client.dto";
import { ClientListQueryDto } from "./dto/client-list-query.dto";
import { ResponseHelper } from "../common/helpers/response.helper";
import { ApiResponse, PaginatedApiResponse } from "../common/interfaces/api-response.interface";

@Injectable()
export class ClientsService {
  constructor(@InjectRepository(Client) private repo: Repository<Client>) {}

  async create(dto: CreateClientDto): Promise<ApiResponse<Client>> {
    const email = dto.email.trim().toLowerCase();
    const exists = await this.repo.findOne({ where: { email } });
    if (exists) throw new BadRequestException("Client with this email already exists");

    const entity = this.repo.create({
      name: dto.name.trim(),
      country: dto.country.trim(),
      address: dto.address.trim(),
      phone: dto.phone.trim(),
      email,
    });
    const saved = await this.repo.save(entity);
    return ResponseHelper.success(saved, "Client created successfully", "Client", 201);
  }

  async update(dto: UpdateClientDto): Promise<ApiResponse<Client>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Client not found");

    const email = dto.email.trim().toLowerCase();
    const conflict = await this.repo.findOne({ where: { email } });
    if (conflict && conflict.id !== dto.id) {
      throw new BadRequestException("Client with this email already exists");
    }

    await this.repo.update(dto.id, {
      name: dto.name.trim(),
      country: dto.country.trim(),
      address: dto.address.trim(),
      phone: dto.phone.trim(),
      email,
    });

    const updated = await this.repo.findOne({ where: { id: dto.id } });
    return ResponseHelper.success(updated!, "Client updated successfully", "Client", 200);
  }

  async getById(id: string): Promise<ApiResponse<Client>> {
    const client = await this.repo.findOne({ where: { id } });
    if (!client) throw new NotFoundException("Client not found");
    return ResponseHelper.success(client, "Client retrieved successfully", "Client", 200);
  }

  async getAll(query: ClientListQueryDto): Promise<PaginatedApiResponse<Client>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder("client")
      .orderBy("client.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      qb.where("client.name ILIKE :search", { search: term })
        .orWhere("client.email ILIKE :search", { search: term })
        .orWhere("client.phone ILIKE :search", { search: term })
        .orWhere("client.country ILIKE :search", { search: term })
        .orWhere("client.address ILIKE :search", { search: term });
    }

    const [items, total] = await qb.getManyAndCount();

    return ResponseHelper.paginated(
      items, page, limit, total,
      "clients",
      "Clients retrieved successfully",
      "Client"
    );
  }

  async delete(dto: DeleteClientDto): Promise<ApiResponse<null>> {
    const current = await this.repo.findOne({ where: { id: dto.id } });
    if (!current) throw new NotFoundException("Client not found");
    await this.repo.remove(current);
    return ResponseHelper.success(null, "Client deleted successfully", "Client", 200);
  }
}
