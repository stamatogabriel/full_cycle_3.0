"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_repository_1 = require("#seedwork/domain/repository/in-memory.repository");
class CategoryInMemoryRepository extends in_memory_repository_1.InMemorySearchableRepository {
    async applyFilter(items, filter) {
        if (!filter)
            return items;
        return items.filter(i => i.props.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    }
}
exports.default = CategoryInMemoryRepository;
