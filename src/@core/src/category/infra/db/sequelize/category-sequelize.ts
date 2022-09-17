import { Op } from "sequelize";
import { Column, DataType, PrimaryKey, Table, Model } from 'sequelize-typescript';

import LoadEntityError from "#seedwork/domain/errors/load-entity.error";
import { SequelizeModelFactory } from '#seedwork/infra/db/sequelize/sequelize.model-factory';
import { UniqueEntityId, NotFoundError, EntityValidationError } from "#seedwork/domain";

import { Category, CategoryRepositoryContract } from "#category/domain";


export namespace CategorySequelize {

  type CategoryModelProperties = {
    id: string
    name: string
    description: string | null;
    is_active: boolean;
    created_at: Date;
  }

  @Table({ tableName: 'categories', timestamps: false })
  export class CategoryModel extends Model<CategoryModelProperties> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    static factory() {
      const chance: Chance.Chance = require('chance')();

      return new SequelizeModelFactory<CategoryModel, CategoryModelProperties>({
        model: CategoryModel,
        defaultFactoryProps: () => ({
          id: chance.guid({ version: 4 }),
          name: chance.word(),
          description: chance.paragraph(),
          is_active: true,
          created_at: chance.date(),
        })
      })
    }
  }

  export class CategoryRepository implements CategoryRepositoryContract.Repository {
    constructor(private categoryModel: typeof CategoryModel) { }

    sortableFields: string[] = ["name", "created_at"];

    async search(props: CategoryRepositoryContract.SearchParams): Promise<CategoryRepositoryContract.SearchResult> {
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
      return new CategoryRepositoryContract.SearchResult({
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
      await this._get(entity.id)
      await this.categoryModel.update(entity.toJSON(), { where: { id: entity.id } })
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`
      await this._get(_id)
      this.categoryModel.destroy({ where: { id: _id } })
    }

    private async _get(id: string) {
      return await this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`)
      });
    }

  }

  export class CategoryModelMapper {
    static toEntity(model: CategoryModel) {
      const { id, ...otherData } = model.toJSON()
      try {
        return new Category(otherData, new UniqueEntityId(id))
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error)
        }

        throw e
      }
    }
  }
}