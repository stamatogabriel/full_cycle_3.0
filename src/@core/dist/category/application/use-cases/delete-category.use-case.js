"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeleteCategoryUseCase {
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async execute(input) {
        const entity = await this.categoryRepo.findById(input.id);
        await this.categoryRepo.delete(entity.id);
        return { message: 'category successfully deleted' };
    }
}
exports.default = DeleteCategoryUseCase;
