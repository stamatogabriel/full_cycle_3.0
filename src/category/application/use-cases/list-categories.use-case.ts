import { CategoryRepository } from "../../domain/repository/category.repository";
import UseCase from "../../../@seedwork/application/use-case";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import { SearchInputDto } from "../../../@seedwork/application/dto/search-input.dto";
import { PaginationOutputDto, PaginationOutputMapper } from "../../../@seedwork/application/dto/pagination-output";

export default class ListCategories implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input) {
    const params = new CategoryRepository.SearchParams(input)
    const searchResult = await this.categoryRepo.search(params)

    return this.toOutput(searchResult)
  }

  private toOutput(searchResult: CategoryRepository.SearchResult): Output {
    return {
      items: searchResult
        .items
        .map(item =>
          CategoryOutputMapper
            .toOutput(item)),
      ...PaginationOutputMapper.toOutput(searchResult)
    }
  }
}

export type Input = SearchInputDto

export type Output = PaginationOutputDto<CategoryOutput>