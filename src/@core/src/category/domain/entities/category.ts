import Entity from  "#seedwork/domain/entities/entity";
import UniqueEntityId from  "#seedwork/domain/value-objects/unique-entity-id.vo";
import CategoryValidatorFactory from "../validators/category.validator";
import { EntityValidationError } from  "#seedwork/domain/errors/validation-error";

export type CategoryProps = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

interface UpdateProps {
  name: string
  description?: string
}

export class Category extends Entity<CategoryProps> {
  constructor(readonly props: CategoryProps, id?: UniqueEntityId) {
    Category.validate(props)
    super(props, id)
    this.description = this.props.description;
    this.is_active = this.props.is_active ?? true;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(updateData: UpdateProps): void {
    Category.validate(updateData)
    this.name = updateData.name
    this.description = updateData.description
  }

  static validate(props: CategoryProps) {
    const validator = CategoryValidatorFactory.create()
    const isValid = validator.validate(props)

    if (!isValid) throw new EntityValidationError(validator.errors)
  }

  activate(): void {
    this.is_active = true
  }

  deactivate(): void {
    this.is_active = false
  }

  get name(): string {
    return this.props.name;
  }


  private set name(value: string) {
    this.props.name = value
  }

  get description(): string | undefined {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active(): boolean | undefined {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at(): Date | undefined {
    return this.props.created_at;
  }
}
