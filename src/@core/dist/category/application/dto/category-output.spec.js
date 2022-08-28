"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("#category/domain/entities/category");
const category_output_1 = require("./category-output");
describe('CategoryOutputMapper Unit Tests', () => {
    it('shoud convert a category in output', () => {
        const created_at = new Date();
        const category = new category_1.Category({
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at
        });
        const spyToJson = jest.spyOn(category, 'toJSON');
        const output = category_output_1.CategoryOutputMapper.toOutput(category);
        expect(output).toStrictEqual({
            id: category.id,
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at
        });
        expect(spyToJson).toBeCalledTimes(1);
    });
});
