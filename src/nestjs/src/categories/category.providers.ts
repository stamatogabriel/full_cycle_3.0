/* eslint-disable @typescript-eslint/no-namespace */
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepositoryContract } from '@fc/micro-videos/category/domain';
import { CategoryInMemoryRepository } from '@fc/micro-videos/category/infra';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }

  export namespace USE_CASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepositoryContract.Repository) =>
        new CreateCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };

    export const LIST_CATEGORY_USE_CASE = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepositoryContract.Repository) =>
        new ListCategoriesUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };

    export const GET_CATEGORY_USE_CASE = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepositoryContract.Repository) =>
        new GetCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };

    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepositoryContract.Repository) =>
        new UpdateCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };

    export const DELETE_CATEGORY_USE_CASE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepositoryContract.Repository) =>
        new DeleteCategoryUseCase.UseCase(categoryRepo),
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };
  }
}
