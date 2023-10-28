export const messageDtoDocs = {
  id: {
    name: 'Id',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'Уникальный идентификатор сообщения',
    required: false,
  },

  content: {
    name: 'Content',
    example: 'Привет, как дела?',
    description: 'Текст сообщения',
  },

  chatId: {
    name: 'ChatId',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'Уникальный идентификатор чата',
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

  createdAt: {
    name: 'CreatedAt',
    example: '2023-10-27T23:53:57.571Z',
    description: 'Дата написания сообщения',
    required: false,
  },
  updatedAt: {
    name: 'UpdatedAt',
    example: '2023-10-27T23:53:57.571Z',
    description: 'Дата изменения сообщения',
    required: false,
  },

  userId: {
    name: 'UserId',
    example: '17d33e46-499b-11e6-80d4-10604ba8b340',
    description: 'UUID пользователя',
  },

  lastSeenAt: {
    name: 'LastSeenAt',
    example: '2023-10-27T23:53:57.571Z',
    description: 'Дата последнее прочитанного сообщения',
  },
};
