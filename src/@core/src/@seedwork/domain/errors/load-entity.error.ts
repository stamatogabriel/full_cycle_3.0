import { FieldsErrors } from "../validators";

export class LoadEntityError extends Error {
  constructor(public error: FieldsErrors, message?: string) {
    super(message ?? 'An entity not be load')
    this.name = "LoadEntityError"
  }
}

export default LoadEntityError