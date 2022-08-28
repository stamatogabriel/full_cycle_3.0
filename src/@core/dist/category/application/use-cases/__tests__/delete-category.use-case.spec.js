"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_error_1 = require("#seedwork/domain/errors/not-found.error");
const category_1 = require("#category/domain/entities/category");
const category_in_memory_repository_1 = require("#category/domain/repository/category-in-memory.repository");
const delete_category_use_case_1 = require("../delete-category.use-case");
describe('DeleteCategoryUseCase Unit Tests', () => {
    let useCase;
    let repository;
    beforeAll(() => {
        repository = new category_in_memory_repository_1.default();
        useCase = new delete_category_use_case_1.default(repository);
    });
    it('should trhows error when entity not found', async () => {
        expect(() => useCase.execute({ id: 'fake id' }))
            .rejects
            .toThrow(new not_found_error_1.default(`Entity not found using ID fake id`));
    });
    it('should delete a category', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        const category = new category_1.Category({ name: 'Movie' });
        repository.items = [category];
        const output = await useCase.execute({ id: category.id });
        expect(output).toStrictEqual({ message: 'category successfully deleted' });
        expect(repository.items).toHaveLength(0);
        expect(spyDelete).toBeCalledTimes(1);
    });
});
