"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const repository_contracts_1 = require("#seedwork/domain/repository/repository-contracts");
var CategoryRepository;
(function (CategoryRepository) {
    class SearchParams extends repository_contracts_1.SearchParams {
    }
    CategoryRepository.SearchParams = SearchParams;
    class SearchResult extends repository_contracts_1.SearchResult {
    }
    CategoryRepository.SearchResult = SearchResult;
})(CategoryRepository = exports.CategoryRepository || (exports.CategoryRepository = {}));
