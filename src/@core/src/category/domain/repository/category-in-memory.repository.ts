import { InMemorySearchableRepository } from '#seedwork/domain/repository/in-memory.repository'
import { Category } from '#category/domain/entities/category'
import { CategoryRepository } from './category.repository'

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository {

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