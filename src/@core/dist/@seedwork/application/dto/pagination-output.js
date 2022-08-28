"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationOutputMapper = void 0;
class PaginationOutputMapper {
    static toOutput(result) {
        return {
            total: result.total,
            current_page: result.current_page,
            last_page: result.last_page,
            per_page: result.per_page,
        };
    }
}
exports.PaginationOutputMapper = PaginationOutputMapper;
