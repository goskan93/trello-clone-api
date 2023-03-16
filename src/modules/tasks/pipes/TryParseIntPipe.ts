import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TryParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Id is not a number');
    }
    return val;
  }
}
