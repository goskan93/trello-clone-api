import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestController {
  constructor() {}

  @Get()
  test() {
    return 'test';
  }
}
