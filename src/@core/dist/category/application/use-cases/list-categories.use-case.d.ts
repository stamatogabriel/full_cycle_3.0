import { CategoryRepository } from "#category/domain/repository/category.repository";
import UseCase from "#seedwork/application/use-case";
import { CategoryOutput } from "../dto/category-output";
import { SearchInputDto } from "#seedwork/application/dto/search-input.dto";
import { PaginationOutputDto } from "#seedwork/application/dto/pagination-output";
export default class ListCategories implements UseCase<Input, Output> {
    private categoryRepo;
    constructor(categoryRepo: CategoryRepository.Repository);
    execute(input: Input): Promise<Output>;
    private toOutput;
}
export declare type Input = SearchInputDto;
export declare type Output = PaginationOutputDto<CategoryOutput>;
