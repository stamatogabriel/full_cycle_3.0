import { Category, CategoryProps } from "./category";
import { omit } from "lodash";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Tests", () => {

  beforeEach(() => {
    Category.validate = jest.fn()
  })

  test("category s constructor", () => {
    let category = new Category({ name: "Movie name" });
    let props = omit(category.props, "created_at");
    expect(props).toStrictEqual({
      name: "Movie name",
      description: null,
      is_active: true,
    });
    expect(category.props.created_at).toBeInstanceOf(Date);
    expect(Category.validate).toHaveBeenCalled()

    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false,
    });
    let created_at = new Date();
    expect(category.props).toStrictEqual({
      name: "Movie",
      description: "some description",
      is_active: false,
      created_at,
    });

    category = new Category({
      name: "Movie",
      description: "other description",
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      description: "other description",
    });

    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      is_active: true,
    });

    created_at = new Date();
    category = new Category({
      name: "Movie",
      created_at,
    });
    expect(category.props).toMatchObject({
      name: "Movie",
      created_at,
    });
  });

  test("id field", () => {
    const data = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      { props: { name: "Movie" }, id: new UniqueEntityId() },
    ];

    data.forEach(item => {
      let category = new Category(item.props, item.id as any);
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    })
  });

  test("category s getter and name field", () => {
    const category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie");

    category["name"] = "other name";
    expect(category.name).toBe("other name");
  });

  test("category s getter and setter description field", () => {
    let category = new Category({
      name: "Movie",
      description: "some description",
    });
    expect(category.description).toBe("some description");

    category = new Category({ name: "Movie" });
    expect(category.description).toBeNull();

    category["description"] = "other description";
    expect(category.description).toBe("other description");

    category["description"] = undefined;
    expect(category.description).toBeNull();

    category["description"] = null;
    expect(category.description).toBeNull();
  });

  test("category s getter and setter is_active field", () => {
    let category = new Category({ name: "Movie", is_active: false });
    expect(category.is_active).not.toBeTruthy();

    category = new Category({ name: "Movie" });
    expect(category.is_active).toBeTruthy();

    category["is_active"] = true;
    expect(category.is_active).toBeTruthy();

    category["is_active"] = undefined;
    expect(category.is_active).toBeTruthy();

    category["is_active"] = null;
    expect(category.is_active).toBeTruthy();
  });

  test("category s getter created_at field", () => {
    let category = new Category({ name: "Movie" });
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    category = new Category({ name: "Movie", created_at });
    expect(category.created_at).toBe(created_at);
  });

  test("category update", () => {
    let category = new Category({ name: "Movie", is_active: false });

    category.update({ name: 'Updated Movie', description: 'this is a description' })

    expect(Category.validate).toHaveBeenCalledTimes(2)
    expect(category.name).toBe('Updated Movie')
    expect(category.description).toBe('this is a description')

    category.update({ name: 'Updated Movie', description: null })
    expect(category.description).toBeNull()

  })

  test("category activate", () => {
    let category = new Category({ name: "Movie", is_active: false });

    category.activate()

    expect(category.is_active).toBeTruthy()
  })

  test("category deactivate", () => {
    let category = new Category({ name: "Movie", is_active: true });

    category.deactivate()

    expect(category.is_active).not.toBeTruthy()
  })
});
