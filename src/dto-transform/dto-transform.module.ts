import { Module } from '@nestjs/common';
import { DtoTransformService } from './dto-transform.service';

@Module({
  providers: [DtoTransformService],
  exports: [DtoTransformService],
})
export class DtoTransformModule {}
