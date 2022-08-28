"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_output_1 = require("../dto/category-output");
class UpdateCategoryUseCase {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(input) {
        const entity = await this.categoryRepo.findById(input.id);
        entity.update({ name: input.name, description: input.description });
        if (input.is_active === true) {
            entity.activate();
        }
        if (input.is_active === false) {
            entity.deactivate();
        }
        await this.categoryRepo.update(entity);
        return category_output_1.CategoryOutputMapper.toOutput(entity);
    }
}
exports.default = UpdateCategoryUseCase;
