import { InMemorySearchableRepository } from '#seedwork/domain/repository/in-memory.repository'
import { Category } from '#category/domain/entities/category'
import { CategoryRepositoryContract } from './category.repository'

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepositoryContract.Repository {

  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(items: Category[], filter: string): Promise<Category[]> {
    if (!filter) return items

    return items
      .filter(item => item.props.name.toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase())
      )
  }

  protected async applySort(items: Category[], sort: string, sort_dir: string): Promise<Category[]> {
    return !sort ? super.applySort(items, "created_at", "desc") : super.applySort(items, sort, sort_dir)
  }
}

export default CategoryInMemoryRepository