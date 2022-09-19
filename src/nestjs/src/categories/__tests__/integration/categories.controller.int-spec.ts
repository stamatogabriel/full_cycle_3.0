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
import { CategorySequelize } from '@fc/micro-videos/category/infra';
import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import { CategoryPresenter } from '../../presenter/category.presenter';

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
    let category: any;

    beforeEach(async () => {
      category = await CategorySequelize.CategoryModel.factory().create();
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
    const category = await CategorySequelize.CategoryModel.factory().create();
    const output = await controller.remove(category.id);

    expect(output).toStrictEqual({ message: 'category successfully deleted' });
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = await CategorySequelize.CategoryModel.factory().create();
    const output = await controller.findOne(category.id);

    expect(output).toBeInstanceOf(CategoryPresenter);
    expect(output.id).toBe(category.id);
    expect(output.created_at).toStrictEqual(category.created_at);
    expect(output.name).toBe(category.name);
    expect(output.description).toBe(category.description);
    expect(output.is_active).toBe(category.is_active);
  });
});
