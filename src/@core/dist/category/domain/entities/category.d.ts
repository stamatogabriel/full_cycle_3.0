import Entity from "#seedwork/domain/entities/entity";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";
export declare type CategoryProps = {
    name: string;
    description?: string;
    is_active?: boolean;
    created_at?: Date;
};
interface UpdateProps {
    name: string;
    description?: string;
}
export declare class Category extends Entity<CategoryProps> {
    readonly props: CategoryProps;
    constructor(props: CategoryProps, id?: UniqueEntityId);
    update(updateData: UpdateProps): void;
    static validate(props: CategoryProps): void;
    activate(): void;
    deactivate(): void;
    get name(): string;
    private set name(value);
    get description(): string | undefined;
    private set description(value);
    get is_active(): boolean | undefined;
    private set is_active(value);
    get created_at(): Date | undefined;
}
export {};
