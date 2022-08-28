"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("#category/domain/entities/category");
const category_in_memory_repository_1 = require("#category/domain/repository/category-in-memory.repository");
const category_repository_1 = require("#category/domain/repository/category.repository");
const list_categories_use_case_1 = require("../list-categories.use-case");
describe('ListCategoriesUseCase Unit Tests', () => {
    let useCase;
    let repository;
    beforeAll(() => {
        repository = new category_in_memory_repository_1.default();
        useCase = new list_categories_use_case_1.default(repository);
    });
    test('to output', () => {
        let result = new category_repository_1.CategoryRepository.SearchResult({
            items: [],
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null,
            total: 1
        });
        let output = useCase['toOutput'](result);
        expect(output).toStrictEqual({
            items: [],
            current_page: 1,
            per_page: 2,
            last_page: 1,
            total: 1
        });
        const category = new category_1.Category({
            name: 'Movie',
        });
        result = new category_repository_1.CategoryRepository.SearchResult({
            items: [category],
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null,
            total: 1
        });
        output = useCase['toOutput'](result);
        expect(output).toStrictEqual({
            items: [category.toJSON()],
            current_page: 1,
            per_page: 2,
            last_page: 1,
            total: 1
        });
    });
    it('should resturn output using empty input with categories ordered by created_at', async () => {
        const created_at = new Date();
        const items = [
            new category_1.Category({ name: 'teste 1', created_at: new Date(created_at.getTime()) }),
            new category_1.Category({ name: 'teste 2', created_at: new Date(created_at.getTime() + 100) }),
        ];
        repository.items = items;
        const output = await useCase.execute({});
        expect(output).toStrictEqual({
            items: [...items].reverse().map(item => item.toJSON()),
            current_page: 1,
            per_page: 15,
            last_page: 1,
            total: 2
        });
    });
    it('should returns outpu using sort and filter', async () => {
        const items = [
            new category_1.Category({ name: 'a' }),
            new category_1.Category({ name: 'AAA' }),
            new category_1.Category({ name: 'AaA' }),
            new category_1.Category({ name: 'b' }),
            new category_1.Category({ name: 'c' }),
        ];
        repository.items = items;
        let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', filter: 'a' });
        expect(output).toStrictEqual({
            items: [items[1].toJSON(), items[2].toJSON()],
            current_page: 1,
            per_page: 2,
            last_page: 2,
            total: 3
        });
        output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', filter: 'a' });
        expect(output).toStrictEqual({
            items: [items[0].toJSON()],
            current_page: 2,
            per_page: 2,
            last_page: 2,
            total: 3
        });
        output = await useCase.execute({ page: 1, per_page: 2, sort_dir: 'desc', sort: 'name', filter: 'a' });
        expect(output).toStrictEqual({
            items: [items[0].toJSON(), items[2].toJSON()],
            current_page: 1,
            per_page: 2,
            last_page: 2,
            total: 3
        });
    });
});
