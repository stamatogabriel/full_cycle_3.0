import ValidatorFieldsInterface, { FieldsErrors } from "./validator-fields-interface";
export declare class ClassValidatorFields<PropsValidate> implements ValidatorFieldsInterface<PropsValidate> {
    errors: FieldsErrors;
    validatedData: PropsValidate;
    validate(data: any): boolean;
}
