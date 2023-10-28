export const globalDocs = {
  title: 'Chat NestJS',
  description:
    'API для чатов на NestJS с использованием REST архитектуры\n\nБаза данных на PostgreSQL',
  version: '1.0.0',
  prefix: 'chat-nestjs',

  requestBody: { description: 'Контейнер с данными' },
  requestCount: { description: 'Общее количество записей в возможном ответе', example: 16 },
  createdAt: { description: 'Дата создания объекта', example: '2023-03-29T14:13:37.960Z' },
  updatedAt: {
    description: 'Дата последнего изменения объекта',
    example: '2023-03-29T14:13:37.960Z',
  },
};
