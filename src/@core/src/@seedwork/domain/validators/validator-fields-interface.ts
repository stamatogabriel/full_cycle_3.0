export type FieldsErrors = {
  [field: string]: string[];
}

export interface ValidatorFieldsInterface<PropsValidate> {
  errors: FieldsErrors;
  validatedData: PropsValidate
  validate(data: any): boolean;
}

export default ValidatorFieldsInterface