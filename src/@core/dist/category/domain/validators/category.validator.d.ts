import { ClassValidatorFields } from "#seedwork/domain/validators/class-validator-fields";
import { CategoryProps } from "../entities/category";
export declare class CategoryRules {
    name: string;
    description: string;
    is_active: boolean;
    created_at: Date;
    constructor({ name, description, is_active, created_at }: CategoryProps);
}
export declare class CategoryValidator extends ClassValidatorFields<CategoryRules> {
    validate(data: CategoryProps): boolean;
}
export default class CategoryValidatorFactory {
    static create(): CategoryValidator;
}
