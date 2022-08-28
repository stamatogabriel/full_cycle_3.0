"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_repository_1 = require("#category/domain/repository/category.repository");
const category_output_1 = require("../dto/category-output");
const pagination_output_1 = require("#seedwork/application/dto/pagination-output");
class ListCategories {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(input) {
        const params = new category_repository_1.CategoryRepository.SearchParams(input);
        const searchResult = await this.categoryRepo.search(params);
        return this.toOutput(searchResult);
    }
    toOutput(searchResult) {
        return Object.assign({ items: searchResult
                .items
                .map(item => category_output_1.CategoryOutputMapper
                .toOutput(item)) }, pagination_output_1.PaginationOutputMapper.toOutput(searchResult));
    }
}
exports.default = ListCategories;
