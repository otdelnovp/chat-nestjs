const BASE_URL = '/chat-nestjs';

const app = () => {
  let selectedUser = null;
  let userItems = [];
  const userList = document.querySelector('.user-list');
  const selectedUserName = document.querySelector('.selected-user');
  const usersPage = document.querySelector('.users-page');
  const usersCreateTest = document.querySelector('.users-create-test');

  let selectedChat = null;
  let chatItems = [];
  const chatList = document.querySelector('.chat-list');
  const selectedChatName = document.querySelector('.selected-chat');
  const chatsPage = document.querySelector('.chats-page');
  const chatsCreateTest = document.querySelector('.chats-create-test');

  const messagesPage = document.querySelector('.messages-page');
  const messageInput = document.querySelector('.message-input');
  const messageList = document.querySelector('.message-list');
  const sendMessageBtn = document.querySelector('.send-message-btn');

  // USERS

  const getUsers = async () => {
    try {
      const { data } = await axios.get(BASE_URL + '/users');
      console.log('users', data);
      renderUsers(data);
      if (!data.length) usersCreateTest.classList.remove('d-none');
    } catch (error) {
      console.log(error.message);
    }
  };
  getUsers(); // init app

  const renderUsers = data => {
    let usersHtml = '';
    data.forEach(
      user =>
        (usersHtml += `
          <li class="bg-dark p-2 rounded mb-2 d-flex user-item" role="button"
            data-user='${JSON.stringify(user)}'>
            <span class="text-info">${user.Name}</span>
          </li>`),
    );
    userList.innerHTML = usersHtml;
    userItems = document.querySelectorAll('.user-item');
    userItems.forEach(userItem =>
      userItem.addEventListener('click', function () {
        selectedUser = JSON.parse(this.dataset.user);
        selectedUserName.innerHTML = selectedUser.Name;
        usersPage.classList.add('d-none');
        getChats();
      }),
    );
  };

  // CHATS

  const getChats = async () => {
    try {
      const { data } = await axios({
        method: 'get',
        url: BASE_URL + '/chats',
        params: { userId: selectedUser.Id },
      });
      console.log('chats', data);
      renderChats(data);
      if (!data.length) chatsCreateTest.classList.remove('d-none');
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderChats = data => {
    let chatsHtml = '';
    data.forEach(
      chat =>
        (chatsHtml += `
          <li class="bg-dark p-2 rounded mb-2 d-flex chat-item" role="button"
            data-chat='${JSON.stringify(chat)}'>
            <span class="text-info">${chat.Unread ? '<big style="color: red">&bull;</big> ' : ''}${
              chat.Name
            }</span>
          </li>`),
    );
    chatList.innerHTML = chatsHtml;
    chatsPage.classList.remove('d-none');
    chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(chatItem =>
      chatItem.addEventListener('click', function () {
        selectedChat = JSON.parse(this.dataset.chat);
        selectedChatName.innerHTML = selectedChat.Name;
        chatsPage.classList.add('d-none');
        getMessages();
      }),
    );
  };

  // MESSAGES

  const getMessages = async () => {
    try {
      const { data } = await axios({
        method: 'get',
        url: BASE_URL + '/messages/' + selectedChat.Id,
        params: { dateFrom: selectedChat.CreatedAt },
      });
      console.log('messages', data);
      renderMessages(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSendMessage = async text => {
    if (!text.trim()) return;
    await axios({
      method: 'post',
      url: BASE_URL + '/messages',
      data: {
        ChatId: selectedChat.Id,
        AuthorId: selectedUser.Id,
        Content: text,
      },
    });
    messageInput.value = '';
    getMessages();
  };

  messageInput.addEventListener(
    'keydown',
    e => e.keyCode === 13 && handleSendMessage(e.target.value),
  );
  sendMessageBtn.addEventListener('click', () => handleSendMessage(messageInput.value));

  const renderMessages = data => {
    let messagesHtml = '';
    data.forEach(
      message =>
        (messagesHtml += `
        <li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
            <div class="mr-2">
                <span class="text-info">${message.AuthorName}</span>
                <div class="text-light">${message.Content}</div>
            </div>
            <span class="text-muted text-right date">
                ${new Date(message.CreatedAt).toLocaleString('ru')}
            </span>
        </li>`),
    );
    messageList.innerHTML = messagesHtml;
    messagesPage.classList.remove('d-none');
  };

  // FAKE DATA

  usersCreateTest.addEventListener('click', () => setUsers());
  const setUsers = async () => {
    const { data } = await axios.get('/chat-nestjs-client/data-example/users.json');
    try {
      const resp = await axios({
        method: 'post',
        url: BASE_URL + '/users',
        data,
      });
      console.log(resp);
      usersCreateTest.classList.add('d-none');
      setTimeout(getUsers, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };

  chatsCreateTest.addEventListener('click', () => setChats());
  const setChats = async () => {
    const { data } = await axios.get('/chat-nestjs-client/data-example/chats.json');
    try {
      const resp1 = await axios({
        method: 'post',
        url: BASE_URL + '/chats',
        data: data[0],
      });
      const resp2 = await axios({
        method: 'post',
        url: BASE_URL + '/chats',
        data: data[1],
      });
      const resp3 = await axios({
        method: 'post',
        url: BASE_URL + '/chats',
        data: data[2],
      });
      console.log(resp1, resp2, resp3);
      chatsCreateTest.classList.add('d-none');
      setTimeout(getChats, 1000);
    } catch (error) {
      console.log(error.message);
    }
  };
};

app();
