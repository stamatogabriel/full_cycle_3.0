import { CategoryRepositoryContract as CategoryRepository } from "#category/domain/repository/category.repository";
import { default as DefaultUseCase } from "#seedwork/application/use-case"

export namespace DeleteCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id)

      await this.categoryRepo.delete(entity.id)

      return { message: 'category successfully deleted' }
    }
  }

  export type Input = {
    id: string
  }

  export type Output = {
    message: string
  }
}

export default DeleteCategoryUseCase