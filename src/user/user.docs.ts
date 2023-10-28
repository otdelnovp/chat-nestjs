export const userDtoDocs = {
  id: {
    name: 'Id',
    example: 'aea0733d-57f9-43f1-9f70-48cceda0d53a',
    description: 'UUID пользователя',
  },
  name: { name: 'Name', example: 'Иванов Петр', description: 'Имя пользователя' },

  email: {
    name: 'Email',
    example: 'user@service.com',
    description: 'Email пользователя (используется для входа в систему)',
    required: false,
  },
  phone: {
    name: 'Phone',
    example: 9261234567,
    description: 'Телефон пользователя (мобильный, числом)',
    required: false,
  },

  created: { name: 'created', example: 5, description: 'Создано' },
  updated: { name: 'updated', example: 2, description: 'Обновлено' },
};
