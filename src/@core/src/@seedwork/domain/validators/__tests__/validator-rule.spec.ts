import { ValidationError } from "../../errors/validation-error";
import ValidatorRules from "../validator-rules";

type Values = {
  value: any;
  property: string;
}

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

function runRule({
  value,
  property,
  rule,
  params = []
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params);
}

describe("ValidatorRules unit test", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rule", () => {
    let arrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: "", property: 'field' },
    ];

    const error = new ValidationError("The field is required.");
    arrange.forEach(t => {
      assertIsInvalid({
        value: t.value,
        property: t.property,
        rule: "required",
        error,
      });
    });

    arrange = [
      { value: 'value', property: 'field' },
      { value: 5, property: 'field' },
      { value: 0, property: 'field' },
      { value: true, property: 'field' },
    ];

    arrange.forEach(t => {
      assertIsValid({
        value: t.value,
        property: t.property,
        rule: "required",
        error,
      });
    });
  });

  test("string validation rule", () => {
    let arrange: Values[] = [
      { value: 5, property: 'field' },
      { value: {}, property: 'field' },
      { value: false, property: 'field' },
    ];

    const error = new ValidationError("The field must be a string.");
    arrange.forEach(t => {
      assertIsInvalid({
        value: t.value,
        property: t.property,
        rule: "string",
        error,
      });
    });

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'value', property: 'field' },
    ];

    arrange.forEach(t => {
      assertIsValid({
        value: t.value,
        property: t.property,
        rule: "string",
        error,
      });
    });
  });

  test("max length validation rule", () => {
    let arrange: Values[] = [
      { value: "7777", property: 'field' },
      { value: "Three", property: 'field' },
    ];

    const error = new ValidationError("The field exceeds the maximum lenght of 3.");
    arrange.forEach(t => {
      assertIsInvalid({
        value: t.value,
        property: t.property,
        rule: "maxLength",
        error,
        params: [3]
      });
    });

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'one', property: 'field' },
    ];

    arrange.forEach(t => {
      assertIsValid({
        value: t.value,
        property: t.property,
        rule: "maxLength",
        error,
        params: [3]
      });
    });
  });

  test("boolean validation rule", () => {
    let arrange: Values[] = [
      { value: 1, property: 'field' },
      { value: "true", property: 'field' },
    ];

    const error = new ValidationError("The field must be a boolean.");
    arrange.forEach(t => {
      assertIsInvalid({
        value: t.value,
        property: t.property,
        rule: "boolean",
        error,
      });
    });

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: false, property: 'field' },
      { value: true, property: 'field' },
    ];

    arrange.forEach(t => {
      assertIsValid({
        value: t.value,
        property: t.property,
        rule: "boolean",
        error,
      });
    });
  });

  it("should throw a validation error when combine two or more validation rules", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError("The field is required."));

    validator = ValidatorRules.values(5, "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError("The field must be a string."));

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError("The field exceeds the maximum lenght of 5.")
    );

    validator = ValidatorRules.values(null, "field");
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError("The field is required."));

    validator = ValidatorRules.values(5, "field");
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError("The field must be a boolean."));
  });

  it("should be valid when combine two or more validation rules", () => {
    expect.assertions(0);
    ValidatorRules.values("test", "field").required().string();
    ValidatorRules.values("aaaaa", "field").required().string().maxLength(5);

    ValidatorRules.values(true, "field").required().boolean();
    ValidatorRules.values(false, "field").required().boolean();
  });
});