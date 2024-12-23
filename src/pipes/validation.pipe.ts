import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || this.isValidatedTypes(metatype)) return value;

    const objectToValidate = plainToInstance(metatype, value);
    const errors = await validate(objectToValidate);
    if (this.isThereErrors(errors))
      throw new BadRequestException('Validation failed');

    return value;
  }

  private isValidatedTypes(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }

  private isThereErrors(errors: any[]) {
    return errors.length > 0;
  }
}
