import { InMemorySearchableRepository } from '#seedwork/domain/repository/in-memory.repository';
import { Category } from '#category/domain/entities/category';
import { CategoryRepository } from './category.repository';
export default class CategoryInMemoryRepository extends InMemorySearchableRepository<Category> implements CategoryRepository.Repository {
    sortableFields: string[];
    protected applyFilter(items: Category[], filter: string): Promise<Category[]>;
    protected applySort(items: Category[], sort: string, sort_dir: string): Promise<Category[]>;
}
