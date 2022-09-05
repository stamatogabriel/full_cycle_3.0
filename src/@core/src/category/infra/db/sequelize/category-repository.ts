import { Category, CategoryRepository } from "#category/domain";
import { UniqueEntityId, NotFoundError } from "#seedwork/domain";
import { Op } from "sequelize";
import { CategoryModel } from "./category-model";
import { CategoryModelMapper } from "./category.mapper";

export class CategorySequelizeRepository implements CategoryRepository.Repository {
  constructor(private categoryModel: typeof CategoryModel) { }

  sortableFields: string[] = ["name", "created_at"];

  async search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page

    const { count, rows: models } = await this.categoryModel.findAndCountAll({
      ...(props.filter && { where: { name: { [Op.like]: `%${props.filter}%` } } }),
      ...(props.sort && this.sortableFields.includes(props.sort) ?
        { order: [[props.sort, props.sort_dir]] } :
        { order: [['created_at', 'DESC']] }),
    offset,
      limit
    })
    return new CategoryRepository.SearchResult({
      items: models.map(item => CategoryModelMapper.toEntity(item)),
      current_page: props.page,
      per_page: props.per_page,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      total: count
    })
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJSON())
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const _id = `${id}`
    const model = await this._get(_id);

    return CategoryModelMapper.toEntity(model);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map(item => CategoryModelMapper.toEntity(item))
  }

  async update(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id, {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`)
    });
  }

}