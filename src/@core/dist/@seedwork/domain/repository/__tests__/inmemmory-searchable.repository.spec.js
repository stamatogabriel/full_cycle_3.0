"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("#seedwork/domain/entities/entity");
const in_memory_repository_1 = require("../in-memory.repository");
const repository_contracts_1 = require("../repository-contracts");
class StubEntity extends entity_1.default {
}
class StubInMemorySearchableRepository extends in_memory_repository_1.InMemorySearchableRepository {
    constructor() {
        super(...arguments);
        this.sortableFields = ['name'];
    }
    async applyFilter(items, filter) {
        if (!filter)
            return items;
        return items.filter(i => i.props.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
            i.props.price.toString() === filter);
    }
}
describe('StubInMemorySearchableRepository Unit Tests', () => {
    let repository = new StubInMemorySearchableRepository();
    beforeEach(() => repository = new StubInMemorySearchableRepository());
    describe('apply filter method', () => {
        it('should no filter items when filter param is null', async () => {
            const items = [new StubEntity({ name: 'value', price: 3 })];
            const spyFilterMethod = jest.spyOn(items, 'filter');
            const itemsFiltered = await repository['applyFilter'](items, null);
            expect(itemsFiltered).toStrictEqual(items);
            expect(spyFilterMethod).not.toBeCalled();
        });
        it('should filter using a filter param', async () => {
            const items = [
                new StubEntity({ name: 'value', price: 3 }),
                new StubEntity({ name: 'teste', price: 4 }),
                new StubEntity({ name: 'Teste', price: 5 }),
                new StubEntity({ name: 'TESTE', price: 3 }),
                new StubEntity({ name: 'fake', price: 0 }),
            ];
            const spyFilterMethod = jest.spyOn(items, 'filter');
            let itemsFiltered = await repository['applyFilter'](items, 'TESTE');
            expect(itemsFiltered).toStrictEqual([items[1], items[2], items[3]]);
            expect(spyFilterMethod).toBeCalledTimes(1);
            itemsFiltered = await repository['applyFilter'](items, '5');
            expect(itemsFiltered).toStrictEqual([items[2]]);
            expect(spyFilterMethod).toBeCalledTimes(2);
            itemsFiltered = await repository['applyFilter'](items, 'no-filter');
            expect(itemsFiltered).toHaveLength(0);
            expect(spyFilterMethod).toBeCalledTimes(3);
        });
    });
    describe('apply sort method', () => {
        it('should no sort items', async () => {
            const items = [
                new StubEntity({ name: 'b', price: 5 }),
                new StubEntity({ name: 'a', price: 5 }),
            ];
            let itemsFiltered = await repository['applySort'](items, null, null);
            expect(itemsFiltered).toStrictEqual(items);
            itemsFiltered = await repository['applySort'](items, 'price', 'asc');
            expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
        });
        it('should sort items', async () => {
            const items = [
                new StubEntity({ name: 'b', price: 3 }),
                new StubEntity({ name: 'a', price: 4 }),
                new StubEntity({ name: 'c', price: 4 }),
            ];
            let itemsFiltered = await repository['applySort'](items, 'name', 'asc');
            expect(itemsFiltered).toStrictEqual([items[1], items[0], items[2]]);
            itemsFiltered = await repository['applySort'](items, 'name', 'desc');
            expect(itemsFiltered).toStrictEqual([items[2], items[0], items[1]]);
        });
    });
    describe('apply paginate method', () => {
        it('paginete items', async () => {
            const items = [
                new StubEntity({ name: 'b', price: 3 }),
                new StubEntity({ name: 'a', price: 4 }),
                new StubEntity({ name: 'c', price: 4 }),
                new StubEntity({ name: 'd', price: 4 }),
                new StubEntity({ name: 'e', price: 4 }),
            ];
            let itemsFiltered = await repository['applyPaginate'](items, 1, 2);
            expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
            itemsFiltered = await repository['applyPaginate'](items, 2, 2);
            expect(itemsFiltered).toStrictEqual([items[2], items[3]]);
            itemsFiltered = await repository['applyPaginate'](items, 3, 2);
            expect(itemsFiltered).toStrictEqual([items[4]]);
            itemsFiltered = await repository['applyPaginate'](items, 4, 2);
            expect(itemsFiltered).toHaveLength(0);
        });
    });
    describe('search method', () => {
        it('should apply only paginate when order param is null', async () => {
            const entity = new StubEntity({ name: 'a', price: 5 });
            const items = Array(16).fill(entity);
            repository.items = items;
            const result = await repository.search(new repository_contracts_1.SearchParams());
            expect(result).toStrictEqual(new repository_contracts_1.SearchResult({
                items: Array(15).fill(entity),
                total: 16,
                current_page: 1,
                per_page: 15,
                sort: null,
                filter: null,
                sort_dir: null
            }));
        });
        it('should apply paginate and filter when order param is null', async () => {
            const items = [
                new StubEntity({ name: 'teste', price: 3 }),
                new StubEntity({ name: 'a', price: 4 }),
                new StubEntity({ name: 'TESTE', price: 4 }),
                new StubEntity({ name: 'tesTe', price: 4 }),
                new StubEntity({ name: '5', price: 4 }),
            ];
            repository.items = items;
            let result = await repository.search(new repository_contracts_1.SearchParams({ page: 1, per_page: 2, filter: 'TESTE' }));
            expect(result).toStrictEqual(new repository_contracts_1.SearchResult({
                items: [items[0], items[2]],
                total: 3,
                current_page: 1,
                per_page: 2,
                sort: null,
                filter: 'TESTE',
                sort_dir: null
            }));
            result = await repository.search(new repository_contracts_1.SearchParams({ page: 2, per_page: 2, filter: 'TESTE' }));
            expect(result).toStrictEqual(new repository_contracts_1.SearchResult({
                items: [items[3]],
                total: 3,
                current_page: 2,
                per_page: 2,
                sort: null,
                filter: 'TESTE',
                sort_dir: null
            }));
        });
        it('should apply paginate and sort when order param is null', async () => {
            const items = [
                new StubEntity({ name: 'b', price: 3 }),
                new StubEntity({ name: 'a', price: 4 }),
                new StubEntity({ name: 'd', price: 4 }),
                new StubEntity({ name: 'c', price: 4 }),
                new StubEntity({ name: 'e', price: 4 }),
            ];
            repository.items = items;
            const arrange = [
                {
                    params: new repository_contracts_1.SearchParams({ page: 1, per_page: 2, sort: 'name' }),
                    result: new repository_contracts_1.SearchResult({
                        items: [items[1], items[0]],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: null,
                        sort_dir: 'asc'
                    })
                },
                {
                    params: new repository_contracts_1.SearchParams({ page: 2, per_page: 2, sort: 'name' }),
                    result: new repository_contracts_1.SearchResult({
                        items: [items[3], items[2]],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        filter: null,
                        sort_dir: 'asc'
                    })
                },
                {
                    params: new repository_contracts_1.SearchParams({ page: 1, per_page: 2, sort: 'name', sort_dir: 'desc' }),
                    result: new repository_contracts_1.SearchResult({
                        items: [items[4], items[2]],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: null,
                        sort_dir: 'desc'
                    })
                },
                {
                    params: new repository_contracts_1.SearchParams({ page: 2, per_page: 2, sort: 'name', sort_dir: 'desc' }),
                    result: new repository_contracts_1.SearchResult({
                        items: [items[3], items[0]],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        filter: null,
                        sort_dir: 'desc'
                    })
                },
            ];
            for (const item of arrange) {
                let result = await repository.search(item.params);
                expect(result).toStrictEqual(item.result);
            }
        });
        it('should apply filter, paginate and sort', async () => {
            const items = [
                new StubEntity({ name: 'teste', price: 3 }),
                new StubEntity({ name: 'a', price: 4 }),
                new StubEntity({ name: 'TESTE', price: 4 }),
                new StubEntity({ name: 'c', price: 4 }),
                new StubEntity({ name: 'teSte', price: 4 }),
            ];
            repository.items = items;
            const arrange = [
                {
                    params: new repository_contracts_1.SearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'teste' }),
                    result: new repository_contracts_1.SearchResult({
                        items: [items[2], items[4]],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: 'teste',
                        sort_dir: 'asc'
                    })
                },
                {
                    params: new repository_contracts_1.SearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'teste' }),
                    result: new repository_contracts_1.SearchResult({
                        items: [items[0]],
                        total: 3,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        filter: 'teste',
                        sort_dir: 'asc'
                    })
                },
            ];
            for (const item of arrange) {
                let result = await repository.search(item.params);
                expect(result).toStrictEqual(item.result);
            }
        });
    });
});
