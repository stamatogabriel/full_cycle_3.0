import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'teste',
      description: 'some description',
      is_active: false,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] = mockCreateUseCase as any;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: false,
    };

    const category = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledTimes(1);
    expect(category).toStrictEqual(output);
  });

  it('should delete a category', async () => {
    const id = '88ad5c34-b24c-4295-be98-2db7dc3699ee';
    const output = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    controller['deleteUseCase'] = mockDeleteUseCase as any;
    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const expectedOutput = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(mockDeleteUseCase.execute).toHaveBeenCalledTimes(2);
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should updates a category', async () => {
    const id = '88ad5c34-b24c-4295-be98-2db7dc3699ee';

    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'teste',
      description: null,
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['updateUseCase'] = mockUpdateUseCase as any;

    const input: UpdateCategoryDto = {
      name: 'teste',
      description: null,
      is_active: false,
    };

    const category = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledTimes(1);
    expect(category).toStrictEqual(output);
  });

  it('should get a category', async () => {
    const id = '88ad5c34-b24c-4295-be98-2db7dc3699ee';

    const output: GetCategoryUseCase.Output = {
      id,
      name: 'teste',
      description: null,
      is_active: true,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['getUseCase'] = mockGetUseCase as any;
    const category = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(mockGetUseCase.execute).toHaveBeenCalledTimes(1);
    expect(category).toStrictEqual(output);
  });

  it('should list  categories', async () => {
    const id = '88ad5c34-b24c-4295-be98-2db7dc3699ee';

    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id,
          name: 'teste',
          description: null,
          is_active: true,
          created_at: new Date(),
        },
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    };

    const input: ListCategoriesUseCase.Input = {
      page: 1,
      per_page: 15,
      sort: null,
      sort_dir: null,
      filter: null,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['listUseCase'] = mockListUseCase as any;
    const category = await controller.findAll(input);

    expect(mockListUseCase.execute).toHaveBeenCalledWith(input);
    expect(mockListUseCase.execute).toHaveBeenCalledTimes(1);
    expect(category).toStrictEqual(output);
  });
});
