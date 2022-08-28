"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("../../entities/category");
const category_in_memory_repository_1 = require("../category-in-memory.repository");
describe("CategoryInMemoryRepository unit tests", () => {
    let repository;
    beforeEach(() => {
        repository = new category_in_memory_repository_1.default();
    });
    it("should not filter items when filter is null", async () => {
        const items = [new category_1.Category({ name: "valid" })];
        const filterSpy = jest.spyOn(items, "filter");
        const filteredItems = await repository["applyFilter"](items, null);
        expect(filteredItems).toStrictEqual(items);
        expect(filterSpy).not.toHaveBeenCalled();
    });
    it("should filter items", async () => {
        const items = [
            new category_1.Category({ name: "valid" }),
            new category_1.Category({ name: "invalid" }),
            new category_1.Category({ name: "fake" }),
            new category_1.Category({ name: "VALID" }),
        ];
        const filterSpy = jest.spyOn(items, "filter");
        const filteredItems = await repository["applyFilter"](items, "valid");
        expect(filteredItems).toStrictEqual([items[0], items[1], items[3]]);
        expect(filterSpy).toHaveBeenCalledTimes(1);
    });
    it("should sort by created_at when sort null", async () => {
        const created_at = new Date();
        const items = [
            new category_1.Category({ name: "valid", created_at: new Date(created_at.getTime()) }),
            new category_1.Category({ name: "invalid", created_at: new Date(created_at.getTime() + 100) }),
            new category_1.Category({ name: "fake", created_at: new Date(created_at.getTime() + 200) }),
            new category_1.Category({ name: "VALID", created_at: new Date(created_at.getTime() + 300) }),
        ];
        const sortedItems = await repository["applySort"](items, null, null);
        expect(sortedItems).toStrictEqual([items[3], items[2], items[1], items[0]]);
    });
    it("should sort by name", async () => {
        const items = [
            new category_1.Category({ name: "valid" }),
            new category_1.Category({ name: "invalid" }),
            new category_1.Category({ name: "fake" }),
            new category_1.Category({ name: "VALID" }),
        ];
        let sortedItems = await repository["applySort"](items, "name", "asc");
        expect(sortedItems).toStrictEqual([items[3], items[2], items[1], items[0]]);
        sortedItems = await repository["applySort"](items, "name", "desc");
        expect(sortedItems).toStrictEqual([items[0], items[1], items[2], items[3]]);
    });
});
