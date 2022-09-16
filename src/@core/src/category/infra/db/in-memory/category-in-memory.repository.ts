import { SortDirection } from "#seedwork/domain/repository/repository-contracts";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory.repository";
import { Category } from "category/domain/entities/category";
import { CategoryRepositoryContract } from "category/domain/repository/category.repository";

export class CategoryInMemoryRepository 
  extends InMemorySearchableRepository<Category> 
  implements CategoryRepositoryContract.Repository {
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[], 
    filter: CategoryRepositoryContract.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter(i => {
      return i.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected async applySort(
    items: Category[], 
    sort: string | null, 
    sort_dir: SortDirection | null
  ): Promise<Category[]> {
    return !sort
      ? super.applySort(items, "created_at", "desc")
      : super.applySort(items, sort, sort_dir);
  }
}

export default CategoryInMemoryRepository