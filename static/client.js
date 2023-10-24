const BASE_URL = 'http://localhost:3444';

const app = () => {
  const socket = io(BASE_URL);

  let selectedUser = null;
  let userItems = [];
  const usersList = document.querySelector('.users-list');
  const selectedUserName = document.querySelector('.selected-user');
  const usersPage = document.querySelector('.users-page');

  let selectedChat = null;
  let chatItems = [];
  const chatsList = document.querySelector('.chats-list');
  const selectedChatName = document.querySelector('.selected-chat');
  const chatsPage = document.querySelector('.chats-page');

  const messagesPage = document.querySelector('.messages-page');
  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.messages-list');
  const sendBtn = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');
  const messages = [];

  // USERS

  const getUsers = async () => {
    try {
      const { data } = await axios.get(BASE_URL + '/users');
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
    usersList.innerHTML = usersHtml;
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
      console.log(data);
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
            <span class="text-info">${chat.name}</span>
          </li>`),
    );
    chatsList.innerHTML = chatsHtml;
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
      console.log(data);
      renderMessages(data);
      data.forEach(item => messages.push(item));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSendMessage = text => {
    if (!text.trim()) {
      return;
    }
    sendMessage({
      username: usernameInput.value || 'Anonymous',
      text,
      createdAt: new Date(),
    });
    msgInput.value = '';
  };

  msgInput.addEventListener('keydown', e => e.keyCode === 13 && handleSendMessage(e.target.value));

  sendBtn.addEventListener('click', () => handleSendMessage(msgInput.value));

  const renderMessages = data => {
    let messagesHtml = '';
    data.forEach(
      message =>
        (messagesHtml += `
        <li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
            <div class="mr-2">
                <span class="text-info">${message.username}</span>
                <p class="text-light">${message.text}</p>
            </div>
            <span class="text-muted text-right date">
                ${new Date(message.createdAt).toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
            </span>
        </li>`),
    );
    msgList.innerHTML = messagesHtml;
    messagesPage.classList.remove('d-none');
  };

  const sendMessage = message => socket.emit('sendMessage', message);

  socket.on('recMessage', message => {
    messages.push(message);
    renderMessages(messages);
  });

  // FAKE DATA

  const setUsers = async () => {
    try {
      const resp = await axios({
        method: 'post',
        url: BASE_URL + '/users',
        data: [
          {
            id: '82879df6-7bfc-11e6-80d5-10604ba8b340',
            name: 'Лефтеров Максим Андреевич',
          },
          {
            id: '56327ba6-799b-11e6-80d5-10604ba8b340',
            name: 'Хайков Михаил Яковлевич',
          },
          {
            id: '17d33e46-499b-11e6-80d4-10604ba8b340',
            name: 'Клюева Ольга Владимировна',
          },
        ],
      });
      console.log(resp);
    } catch (error) {
      console.log(error.message);
    }
  };
  // setUsers();

  const setChats = async () => {
    try {
      const resp1 = await axios({
        method: 'post',
        url: BASE_URL + '/chats',
        data: {
          name: 'Чат на двоих',
          parentId: 'ef685bae-2a3a-a6f5-b7f8-83b3f5aa5a99',
          authorId: '82879df6-7bfc-11e6-80d5-10604ba8b340',
          users: [
            { id: '82879df6-7bfc-11e6-80d5-10604ba8b340' },
            { id: '56327ba6-799b-11e6-80d5-10604ba8b340' },
          ],
        },
      });
      const resp2 = await axios({
        method: 'post',
        url: BASE_URL + '/chats',
        data: {
          name: 'Чат на 3-их',
          parentId: 'ef685bae-2a3a-a6f5-b7f8-83b3f5aa5a99',
          authorId: '17d33e46-499b-11e6-80d4-10604ba8b340',
          users: [
            { id: '82879df6-7bfc-11e6-80d5-10604ba8b340' },
            { id: '56327ba6-799b-11e6-80d5-10604ba8b340' },
            { id: '17d33e46-499b-11e6-80d4-10604ba8b340' },
          ],
        },
      });
      const resp3 = await axios({
        method: 'post',
        url: BASE_URL + '/chats',
        data: {
          name: 'Еще один чат',
          parentId: 'ef685bae-2a3a-a6f5-b7f8-83b3f5aa5a99',
          authorId: '17d33e46-499b-11e6-80d4-10604ba8b340',
          users: [
            { id: '82879df6-7bfc-11e6-80d5-10604ba8b340' },
            { id: '17d33e46-499b-11e6-80d4-10604ba8b340' },
          ],
        },
      });
      console.log(resp1, resp2, resp3);
    } catch (error) {
      console.log(error.message);
    }
  };
  // setChats();
};

app();
