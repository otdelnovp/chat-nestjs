const BASE_URL = '/chat-nestjs';

const app = () => {
  let selectedUser = null;
  let userItems = [];
  const userList = document.querySelector('.user-list');
  const selectedUserName = document.querySelector('.selected-user');
  const usersPage = document.querySelector('.users-page');

  let selectedChat = null;
  let chatItems = [];
  const chatList = document.querySelector('.chat-list');
  const selectedChatName = document.querySelector('.selected-chat');
  const chatsPage = document.querySelector('.chats-page');

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
            <span class="text-info">${user.name}</span>
          </li>`),
    );
    userList.innerHTML = usersHtml;
    userItems = document.querySelectorAll('.user-item');
    userItems.forEach(userItem =>
      userItem.addEventListener('click', function () {
        selectedUser = JSON.parse(this.dataset.user);
        selectedUserName.innerHTML = selectedUser.name;
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
        params: { userId: selectedUser.id },
      });
      console.log('chats', data);
      renderChats(data);
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
            <span class="text-info">${chat.unread ? '<big style="color: red">&bull;</big> ' : ''}${
              chat.name
            }</span>
          </li>`),
    );
    chatList.innerHTML = chatsHtml;
    chatsPage.classList.remove('d-none');
    chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(chatItem =>
      chatItem.addEventListener('click', function () {
        selectedChat = JSON.parse(this.dataset.chat);
        selectedChatName.innerHTML = selectedChat.name;
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
        url: BASE_URL + '/messages/' + selectedChat.id,
        params: { dateFrom: selectedChat.createdAt },
      });
      console.log('messages', data);
      renderMessages(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSendMessage = text => {
    if (!text.trim()) return;
    axios({
      method: 'post',
      url: BASE_URL + '/messages',
      data: {
        chatId: selectedChat.id,
        authorId: selectedUser.id,
        content: text,
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
                <span class="text-info">${message.author.name}</span>
                <div class="text-light">${message.content}</div>
            </div>
            <span class="text-muted text-right date">
                ${new Date(message.createdAt).toLocaleString('ru')}
            </span>
        </li>`),
    );
    messageList.innerHTML = messagesHtml;
    messagesPage.classList.remove('d-none');
  };

  // FAKE DATA

  const setUsers = async () => {
    const { data } = await axios.get(BASE_URL + '/data-example/users.json');
    try {
      const resp = await axios({
        method: 'post',
        url: BASE_URL + '/users',
        data,
      });
      console.log(resp);
    } catch (error) {
      console.log(error.message);
    }
  };
  // setUsers();

  const setChats = async () => {
    const { data } = await axios.get(BASE_URL + '/data-example/chats.json');
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
    } catch (error) {
      console.log(error.message);
    }
  };
  // setChats();
};

app();
