"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("#category/domain/entities/category");
const not_found_error_1 = require("#seedwork/domain/errors/not-found.error");
const category_in_memory_repository_1 = require("#category/domain/repository/category-in-memory.repository");
const get_category_use_case_1 = require("../get-category.use-case");
describe('GetCategoryUseCase Unit Tests', () => {
    let useCase;
    let repository;
    beforeAll(() => {
        repository = new category_in_memory_repository_1.default();
        useCase = new get_category_use_case_1.default(repository);
    });
    it('should trhows error when entity not found', async () => {
        expect(() => useCase.execute({ id: 'fake id' }))
            .rejects
            .toThrow(new not_found_error_1.default(`Entity not found using ID fake id`));
    });
    it('should returns a category', async () => {
        const items = [
            new category_1.Category({ name: 'movie' })
        ];
        repository.items = items;
        const spyFindById = jest.spyOn(repository, 'findById');
        const output = await useCase.execute({ id: items[0].id });
        expect(output).toStrictEqual({
            id: repository.items[0].id,
            name: 'movie',
            description: null,
            is_active: true,
            created_at: repository.items[0].created_at
        });
        expect(spyFindById).toBeCalledTimes(1);
    });
});
