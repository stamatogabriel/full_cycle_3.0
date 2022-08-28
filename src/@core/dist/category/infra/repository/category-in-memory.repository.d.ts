import { Category } from "#category/domain/entities/category";
import { CategoryRepository } from "#category/domain/repository/category.repository";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory.repository";
export default class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepository.Repository {
    protected applyFilter(items: Category[], filter: CategoryRepository.Filter): Promise<Category[]>;
}
