export const chatDtoDocs = {
  id: {
    name: 'Id',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'Уникальный идентификатор чата',
  },
  chatId: {
    name: 'ChatId',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'Уникальный идентификатор чата',
  },
  name: {
    name: 'Name',
    example: 'Чат на заказ №123456 от 30.09.2023',
    description: 'Название чата',
  },

  authorId: {
    name: 'AuthorId',
    example: '17d33e46-499b-11e6-80d4-10604ba8b340',
    description: 'UUID автора чата',
  },
  authorName: {
    name: 'AuthorName',
    example: 'Клюева Ольга Владимировна',
    description: 'Имя автора чата',
  },

  parentId: {
    name: 'ParentId',
    example: 'ef685bae-2a3a-a6f5-b7f8-83b3f5aa5a99',
    description: 'UUID родительской сущности для которой создается чат',
    required: false,
  },

  createdAt: {
    name: 'CreatedAt',
    example: '2023-10-27T23:53:57.571Z',
    description: 'Дата создания чата',
    required: false,
  },
  updatedAt: {
    name: 'UpdatedAt',
    example: '2023-10-27T23:53:57.571Z',
    description: 'Дата последнего сообщения',
    required: false,
  },

  unread: {
    name: 'Unread',
    example: false,
    description: 'Есть ли непрочитанные сообщению у юзера который запросил чат',
    required: false,
  },

  users: {
    name: 'Users',
    description: 'Список участников чата',
  },
  userId: {
    name: 'Id',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'UUID участника чата',
  },
  userIdd: {
    name: 'UserId',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'UUID участника чата',
  },
  lastSeenAt: {
    name: 'LastSeenAt',
    example: '2023-10-27T23:53:57.571Z',
    description: 'Время последнего прочитанного сообщения',
  },
};
