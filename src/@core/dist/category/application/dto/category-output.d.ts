import { Category } from "#category/domain/entities/category";
export declare type CategoryOutput = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
};
export declare class CategoryOutputMapper {
    static toOutput(entity: Category): Required<{
        id: string;
    } & import("#category/domain/entities/category").CategoryProps>;
}
