import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGurad } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current_user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from 'src/interceptors/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGurad)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user:User) {
    return this.reportsService.create(body, user);
  }
}
