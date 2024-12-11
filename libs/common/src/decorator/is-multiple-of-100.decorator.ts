import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsMultipleOf100(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMultipleOf100',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'number' && value % 100 === 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a multiple of 100`;
        },
      },
    });
  };
}
