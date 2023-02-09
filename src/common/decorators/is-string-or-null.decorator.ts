import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: StringOrNullConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsStringOrNull' })
export class StringOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' || value === null;
  }
}
