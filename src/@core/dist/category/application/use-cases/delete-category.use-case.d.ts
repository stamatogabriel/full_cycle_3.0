import { CategoryRepository } from "#category/domain/repository/category.repository";
import UseCase from "#seedwork/application/use-case";
export default class DeleteCategoryUseCase implements UseCase<Input, Output> {
    private categoryRepo;
    constructor(categoryRepo: CategoryRepository.Repository);
    execute(input: Input): Promise<Output>;
}
export declare type Input = {
    id: string;
};
export declare type Output = {
    message: string;
};
