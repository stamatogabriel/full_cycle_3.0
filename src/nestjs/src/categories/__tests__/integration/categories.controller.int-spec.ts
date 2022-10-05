import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesModule } from '../../categories.module';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesController } from '../../categories.controller';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CATEGORY_PROVIDERS } from '../../category.providers';
import {
  NotFoundError,
  SortDirection,
} from '@fc/micro-videos/@seedwork/domain';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../presenter/category.presenter';
import { Category } from '@fc/micro-videos/category/domain';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
  });

  describe('should create a category', () => {
    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedOutput: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'some description',
          is_active: false,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'some description',
          is_active: false,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'some description',
          is_active: true,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'some description',
          is_active: true,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedOutput }) => {
        const output = await controller.create(request);
        const entity = await repository.findById(output.id);

        expect(entity).toMatchObject({
          id: output.id,
          name: expectedOutput.name,
          description: expectedOutput.description,
          is_active: expectedOutput.is_active,
          created_at: output.created_at,
        });

        expect(output.id).toBe(entity.id);
        expect(output.created_at).toStrictEqual(entity.created_at);
        expect(output.name).toBe('Movie');
        expect(output.description).toBe(expectedOutput.description);
        expect(output.is_active).toBe(expectedOutput.is_active);
      },
    );
  });

  describe('should update a category', () => {
    const category = Category.fake().aCategory().build();

    beforeEach(async () => {
      await repository.insert(category);
    });

    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedOutput: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'some description',
          is_active: false,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'some description',
          is_active: false,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'some description',
          is_active: true,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'some description',
          is_active: true,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedOutput }) => {
        const output = await controller.update(category.id, request);
        const entity = await repository.findById(category.id);

        expect(output).toBeInstanceOf(CategoryPresenter);
        expect(entity).toMatchObject({
          id: output.id,
          name: expectedOutput.name,
          description: expectedOutput.description,
          is_active: expectedOutput.is_active,
          created_at: output.created_at,
        });

        expect(output.id).toBe(entity.id);
        expect(output.created_at).toStrictEqual(entity.created_at);
        expect(output.name).toBe('Movie');
        expect(output.description).toBe(expectedOutput.description);
        expect(output.is_active).toBe(expectedOutput.is_active);
      },
    );
  });

  it('delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await controller.remove(category.id);

    expect(output).toStrictEqual({ message: 'category successfully deleted' });
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await controller.findOne(category.id);

    expect(output).toBeInstanceOf(CategoryPresenter);
    expect(output.id).toBe(category.id);
    expect(output.created_at).toStrictEqual(category.created_at);
    expect(output.name).toBe(category.name);
    expect(output.description).toBe(category.description);
    expect(output.is_active).toBe(category.is_active);
  });

  describe('search method', () => {
    it('should return categories using a query empty ordered by created_at', async () => {
      const categories = Category.fake()
        .theCategories(4)
        .withName((index) => index + '')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build();

      await repository.bulkInsert(categories);

      const arrange = [
        {
          sendData: {},
          expected: {
            items: [categories[3], categories[2], categories[1], categories[0]],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
        {
          sendData: { per_page: 2 },
          expected: {
            items: [categories[3], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
        {
          sendData: { per_page: 2, page: 2 },
          expected: {
            items: [categories[1], categories[0]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      ];

      for (const item of arrange) {
        const presenter = await controller.search(item.sendData);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });

    it('should returns outpu using sort and filter', async () => {
      const faker = Category.fake().aCategory();
      const categories = [
        faker.withName('a').build(),
        faker.withName('AAA').build(),
        faker.withName('AaA').build(),
        faker.withName('b').build(),
        faker.withName('c').build(),
      ];

      await repository.bulkInsert(categories);

      const arrange_desc = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[0], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          sendData: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[1]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      ];

      for (const item of arrange_desc) {
        const presenter = await controller.search(item.sendData);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }

      const arrange_asc = [
        {
          sendData: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[1], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          sendData: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'asc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [categories[0]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      ];

      for (const item of arrange_asc) {
        const presenter = await controller.search(item.sendData);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected),
        );
      }
    });
  });
});
