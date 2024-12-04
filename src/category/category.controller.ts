import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from '../auth/guard';
import { CategoryService } from './category.service';
import { GetUser } from '../auth/decorator';
import { CreateCategoryDto } from './dto/createCategory.dto';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Delete(':id')
  deleteCategory(
    @GetUser('id') userid: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.deleteCategory(userid, categoryId);
  }
}
