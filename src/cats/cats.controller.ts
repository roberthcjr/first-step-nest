import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  Query,
  ForbiddenException,
  UseFilters,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './entities/cat.entity';
import { HttpExceptionFilter } from 'src/utils/exceptions/HttpExceptionFilter';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createCatDto: CreateCatDto,
  ): Promise<string> {
    this.catsService.create(createCatDto);
    return `This route will create a new cat:
    ${createCatDto.age}, ${createCatDto.breed}, ${createCatDto.name}`;
  }

  @Get()
  @UseFilters(HttpExceptionFilter)
  async findAll(): Promise<Cat[]> {
    throw new ForbiddenException('Cat not permitted', {
      cause: new Error('Wrong password'),
      description: 'The given password is wrong',
    });
  }

  @Get('url')
  @Redirect('http://localhost:3000/cats', 302)
  getCats(@Query('quantity') quantity) {
    if (quantity < '3') return { url: 'https://docs.nestjs.com/v5/' };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): string {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
