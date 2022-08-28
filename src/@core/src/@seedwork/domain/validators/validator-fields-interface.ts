export type FieldsErrors = {
  [field: string]: string[];
}

export default interface ValidatorFieldsInterface<PropsValidate> {
  errors: FieldsErrors;
  validatedData: PropsValidate
  validate(data: any): boolean;
}