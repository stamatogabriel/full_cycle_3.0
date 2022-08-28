"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../../entities/entity");
const not_found_error_1 = require("../../errors/not-found.error");
const unique_entity_id_vo_1 = require("../../value-objects/unique-entity-id.vo");
const in_memory_repository_1 = require("../in-memory.repository");
class StubEntity extends entity_1.default {
}
class StubMemoryRepository extends in_memory_repository_1.InMemoryRepository {
}
describe('InMemoryRepository Unit Tests', () => {
    let repository;
    beforeEach(() => repository = new StubMemoryRepository());
    it('should inserts a new entity', async () => {
        const entity = new StubEntity({ name: 'name value', price: 3 });
        await repository.insert(entity);
        expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
    });
    it('should throws error when entity not found', () => {
        expect(repository.findById('fake id')).rejects.toThrow(new not_found_error_1.default(`Entity not found using ID fake id`));
        const id = new unique_entity_id_vo_1.default();
        expect(repository.findById(id)).rejects.toThrow(new not_found_error_1.default(`Entity not found using ID ${id}`));
    });
    it('should find a entity by id', async () => {
        const entity = new StubEntity({ name: 'name value', price: 3 });
        await repository.insert(entity);
        let entityFound = await repository.findById(entity.id);
        expect(entityFound.toJSON()).toStrictEqual(entityFound.toJSON());
        entityFound = await repository.findById(entity.uniqueEntityId);
        expect(entityFound.toJSON()).toStrictEqual(entityFound.toJSON());
    });
    it('should return all entities', async () => {
        const entity = new StubEntity({ name: 'name value', price: 3 });
        await repository.insert(entity);
        const entities = await repository.findAll();
        expect(entities).toStrictEqual([entity]);
    });
    it('should throws error on update when entity not found', () => {
        const entity = new StubEntity({ name: 'name value', price: 3 });
        expect(repository.update(entity)).rejects.toThrow(new not_found_error_1.default(`Entity not found using ID ${entity.id}`));
    });
    it('should updates an entity', async () => {
        const entity = new StubEntity({ name: 'name value', price: 3 });
        await repository.insert(entity);
        const entityUpdated = new StubEntity({ name: 'updated value', price: 5 }, entity.uniqueEntityId);
        await repository.update(entityUpdated);
        expect(entityUpdated.toJSON()).toStrictEqual(repository.items[0].toJSON());
    });
    it('should throws error on delete when entity not found', () => {
        expect(repository.delete('fake id')).rejects.toThrow(new not_found_error_1.default(`Entity not found using ID fake id`));
        const id = new unique_entity_id_vo_1.default();
        expect(repository.delete(id)).rejects.toThrow(new not_found_error_1.default(`Entity not found using ID ${id}`));
    });
    it('should deletes an entity', async () => {
        const entity = new StubEntity({ name: 'name value', price: 3 });
        await repository.insert(entity);
        await repository.delete(entity.id);
        expect(repository.items).toHaveLength(0);
        await repository.insert(entity);
        await repository.delete(entity.uniqueEntityId);
        expect(repository.items).toHaveLength(0);
    });
});
