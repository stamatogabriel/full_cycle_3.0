"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("#category/domain/entities/category");
const not_found_error_1 = require("#seedwork/domain/errors/not-found.error");
const category_in_memory_repository_1 = require("#category/domain/repository/category-in-memory.repository");
const update_category_use_case_1 = require("../update-category.use-case");
describe('UpdateCategoryUseCase Unit Tests', () => {
    let useCase;
    let repository;
    beforeAll(() => {
        repository = new category_in_memory_repository_1.default();
        useCase = new update_category_use_case_1.default(repository);
    });
    it('should trhows error when entity not found', async () => {
        expect(() => useCase.execute({ id: 'fake id', name: 'Movie' }))
            .rejects
            .toThrow(new not_found_error_1.default(`Entity not found using ID fake id`));
    });
    it('should update a category', async () => {
        const spyUpdate = jest.spyOn(repository, 'update');
        const category = new category_1.Category({ name: 'Movie' });
        const arrange = [
            {
                entity: {
                    name: 'teste',
                    id: category.id,
                },
                expected: {
                    id: category.id,
                    name: 'teste',
                    description: null,
                    is_active: true,
                    created_at: category.created_at
                },
            },
            {
                entity: {
                    id: category.id,
                    name: 'teste',
                    description: 'some description',
                },
                expected: {
                    id: category.id,
                    name: 'teste',
                    description: 'some description',
                    is_active: true,
                    created_at: category.created_at
                },
            },
            {
                entity: {
                    name: 'teste',
                    id: category.id,
                },
                expected: {
                    id: category.id,
                    name: 'teste',
                    description: null,
                    is_active: true,
                    created_at: category.created_at
                },
            },
            {
                entity: {
                    name: 'teste',
                    id: category.id,
                    is_active: false
                },
                expected: {
                    id: category.id,
                    name: 'teste',
                    description: null,
                    is_active: false,
                    created_at: category.created_at
                },
            },
            {
                entity: {
                    name: 'teste',
                    id: category.id,
                    is_active: true
                },
                expected: {
                    id: category.id,
                    name: 'teste',
                    description: null,
                    is_active: true,
                    created_at: category.created_at
                },
            },
            {
                entity: {
                    name: 'teste',
                    description: 'some description',
                    id: category.id,
                    is_active: false
                },
                expected: {
                    id: category.id,
                    name: 'teste',
                    description: 'some description',
                    is_active: false,
                    created_at: category.created_at
                },
            }
        ];
        repository.items = [category];
        let output = await useCase.execute(arrange[0].entity);
        expect(output).toStrictEqual(arrange[0].expected);
        expect(spyUpdate).toBeCalledTimes(1);
        output = await useCase.execute(arrange[1].entity);
        expect(output).toStrictEqual(arrange[1].expected);
        expect(spyUpdate).toBeCalledTimes(2);
        output = await useCase.execute(arrange[2].entity);
        expect(output).toStrictEqual(arrange[2].expected);
        expect(spyUpdate).toBeCalledTimes(3);
        output = await useCase.execute(arrange[3].entity);
        expect(output).toStrictEqual(arrange[3].expected);
        expect(spyUpdate).toBeCalledTimes(4);
        output = await useCase.execute(arrange[4].entity);
        expect(output).toStrictEqual(arrange[4].expected);
        expect(spyUpdate).toBeCalledTimes(5);
        output = await useCase.execute(arrange[5].entity);
        expect(output).toStrictEqual(arrange[5].expected);
        expect(spyUpdate).toBeCalledTimes(6);
    });
});
