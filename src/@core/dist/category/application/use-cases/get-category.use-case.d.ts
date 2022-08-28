import UseCase from "#seedwork/application/use-case";
import { CategoryRepository } from "#category/domain/repository/category.repository";
import { CategoryOutput } from '../dto/category-output';
export default class GetCategoryUseCase implements UseCase<Input, Output> {
    private categoryRepo;
    constructor(categoryRepo: CategoryRepository.Repository);
    execute(input: Input): Promise<Output>;
}
export declare type Input = {
    id: string;
};
export declare type Output = CategoryOutput;
