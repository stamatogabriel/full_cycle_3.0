export default class ValidatorRules {
    private value;
    private property;
    private constructor();
    static values(value: any, property: string): ValidatorRules;
    required(): Omit<this, 'required'>;
    string(): Omit<this, 'string'>;
    maxLength(max: number): Omit<this, 'maxLength'>;
    boolean(): Omit<this, 'boolean'>;
}
export declare function isEmpty(value: any): boolean;
