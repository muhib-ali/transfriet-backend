import { Module as NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobFilesController } from "./job_files.controller";
import { JobFilesService } from "./job_files.service";
import { JobFile } from "../entities/job-file.entity";

@NestModule({
  imports: [TypeOrmModule.forFeature([JobFile])],
  controllers: [JobFilesController],
  providers: [JobFilesService],
  exports: [JobFilesService],
})
export class JobFilesModule {}
