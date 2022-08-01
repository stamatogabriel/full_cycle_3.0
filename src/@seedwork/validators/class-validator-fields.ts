import { validateSync } from "class-validator";
import ValidatorFieldsInterface, { FieldsErrors } from "./validator-fields-interface";

class ClassValidatorFields<PropsValidate> implements ValidatorFieldsInterface<PropsValidate> {
  errors: FieldsErrors = null;
  validatedData: PropsValidate = null;
  validate(data: any): boolean {
    const errors = validateSync(data)

    if(errors.length) {
      this.errors = {}
      for (const error of errors) {
        const field = error.property
        this.errors[field] = Object.values(error.constraints)
      }
    } else {
      this.validatedData = data
    }

    return !errors.length
  }

}