"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_contracts_1 = require("../../domain/repository/repository-contracts");
const pagination_output_1 = require("./pagination-output");
describe('PaginationOutputMapper Unit Tests', () => {
    it('shoud convert a SearchResult in output', () => {
        const result = new repository_contracts_1.SearchResult({
            items: ['fake'],
            total: 1,
            current_page: 1,
            per_page: 1,
            sort: 'name',
            sort_dir: 'desc',
            filter: 'fake'
        });
        const output = pagination_output_1.PaginationOutputMapper.toOutput(result);
        expect(output).toStrictEqual({
            total: 1,
            current_page: 1,
            last_page: 1,
            per_page: 1,
        });
    });
});
