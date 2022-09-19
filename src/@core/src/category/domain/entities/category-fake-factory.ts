import { Category } from "./category"
import { Chance } from 'chance'

type PropOrFactory<T> = T | ((index) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private chance: Chance.Chance
  private name: PropOrFactory<string> = (_index) => this.chance.word();
  private description: PropOrFactory<string | null> = (_index) => this.chance.paragraph();
  private is_active: PropOrFactory<boolean> = (_index) => true;
  private countObjs: number

  static aCategory() {
    return new CategoryFakeBuilder<Category>()
  }

  static theCategories() {
    return new CategoryFakeBuilder<Category[]>()
  }

  constructor(countObjs: number = 1) {
    this.countObjs = countObjs
    this.chance = Chance()
  }

  withName(name: PropOrFactory<string>) { // fluent pattern
    this.name = name
    return this;
  }

  withDescription(description: PropOrFactory<string | null>) {
    this.description = description
    return this;
  }

  activate() {
    this.is_active = true
    return this;
  }

  deactivate() {
    this.is_active = false
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs).fill(undefined).map((_, index) => (
      new Category({
        name: this.callFactory(this.name, index),
        description: this.callFactory(this.description, index),
        is_active: this.callFactory(this.is_active, index),
      })
    ));

    return this.countObjs === 1 ? categories[0] as any : categories
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function' ? factoryOrValue(index) : factoryOrValue
  }
}