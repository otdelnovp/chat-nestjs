import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';

@Injectable()
export class DtoTransformService {
  toClass(dto: object, DtoClass: ClassConstructor<any>) {
    return plainToClass(DtoClass, dto, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });
  }

  toClassArray(dto: object[], DtoClass: ClassConstructor<any>) {
    return dto.map(dtoItem =>
      plainToClass(DtoClass, dtoItem, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      }),
    );
  }
}
