"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_in_memory_repository_1 = require("#category/domain/repository/category-in-memory.repository");
const create_category_use_case_1 = require("../create-category.use-case");
describe('CreateCategoryUseCase Unit Tests', () => {
    let useCase;
    let repository;
    beforeAll(() => {
        repository = new category_in_memory_repository_1.default();
        useCase = new create_category_use_case_1.default(repository);
    });
    it('should create a category', async () => {
        const spyInsert = jest.spyOn(repository, 'insert');
        let output = await useCase.execute({ name: 'teste' });
        expect(output).toStrictEqual({
            id: repository.items[0].id,
            name: 'teste',
            description: null,
            is_active: true,
            created_at: repository.items[0].created_at
        });
        expect(spyInsert).toBeCalledTimes(1);
        output = await useCase.execute({ name: 'teste', description: 'some description', is_active: false });
        expect(output).toStrictEqual({
            id: repository.items[1].id,
            name: 'teste',
            description: 'some description',
            is_active: false,
            created_at: repository.items[1].created_at
        });
        expect(spyInsert).toBeCalledTimes(2);
    });
});
