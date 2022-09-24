import { CategoryFakeBuilder } from "#category/domain/entities/category-fake-factory";
import { Category } from "../../../domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe("CategoryInMemoryRepository unit tests", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it("should not filter items when filter is null", async () => {
    const items = CategoryFakeBuilder.theCategories(3).build();
    const filterSpy = jest.spyOn(items, "filter" as any);

    const filteredItems = await repository["applyFilter"](items, null);
    expect(filteredItems).toStrictEqual(items);
    expect(filterSpy).not.toHaveBeenCalled();
  });

  it("should filter items", async () => {
    const faker = CategoryFakeBuilder.aCategory()
    const items = [
      faker.withName('valid').build(),
      faker.withName('invalid').build(),
      faker.withName('fake').build(),
      faker.withName('VALID').build(),
    ];

    const filterSpy = jest.spyOn(items, "filter" as any);

    const filteredItems = await repository["applyFilter"](items, "valid");
    expect(filteredItems).toStrictEqual([items[0], items[1], items[3]]);
    expect(filterSpy).toHaveBeenCalledTimes(1);
  });

  it("should sort by created_at when sort null", async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: "valid", created_at: new Date(created_at.getTime()) }),
      new Category({ name: "invalid", created_at: new Date(created_at.getTime() + 100) }),
      new Category({ name: "fake", created_at: new Date(created_at.getTime() + 200) }),
      new Category({ name: "VALID", created_at: new Date(created_at.getTime() + 300) }),
    ];

    const sortedItems = await repository["applySort"](items, null, null);
    expect(sortedItems).toStrictEqual([items[3], items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      new Category({ name: "valid" }),
      new Category({ name: "invalid" }),
      new Category({ name: "fake" }),
      new Category({ name: "VALID" }),
    ];

    let sortedItems = await repository["applySort"](items, "name", "asc");
    expect(sortedItems).toStrictEqual([items[3], items[2], items[1], items[0]]);

    sortedItems = await repository["applySort"](items, "name", "desc");
    expect(sortedItems).toStrictEqual([items[0], items[1], items[2], items[3]]);
  });
});