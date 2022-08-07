import { Category } from "category/domain/entities/category";
import CategoryRepositoryInterface from "category/domain/repository/category.repository";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory.repository";

class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepositoryInterface {

}