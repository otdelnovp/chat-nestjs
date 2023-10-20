const BASE_URL = 'http://localhost:3444';

const app = () => {
  const socket = io(BASE_URL);

  let selectedUser = null;
  const selectedUserName = document.querySelector('.selected-user');

  const usersPage = document.querySelector('.users-page');
  const messagesPage = document.querySelector('.messages-page');

  let userItems = [];
  const usersList = document.querySelector('.users-list');

  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.messages-list');
  const sendBtn = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');
  const messages = [];

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
    let users = '';
    data.forEach(
      user =>
        (users += `
          <li class="bg-dark p-2 rounded mb-2 d-flex user-item" role="button"
            data-user='${JSON.stringify(user)}'>
            <span class="text-info">${user.name}</span>
          </li>`),
    );
    usersList.innerHTML = users;
    userItems = document.querySelectorAll('.user-item');
    userItems.forEach(userItem =>
      userItem.addEventListener('click', function () {
        selectedUser = JSON.parse(this.dataset.user);
        selectedUserName.innerHTML = selectedUser.name;
        usersPage.classList.add('d-none');
      }),
    );
  };

  const getMessages = async () => {
    try {
      const { data } = await axios.get(BASE_URL + '/chat');

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
    let messages = '';

    data.forEach(
      message =>
        (messages += `
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

    msgList.innerHTML = messages;
  };

  const sendMessage = message => socket.emit('sendMessage', message);

  socket.on('recMessage', message => {
    messages.push(message);
    renderMessages(messages);
  });

  const setUsers = async () => {
    try {
      const resp = await axios({
        method: 'post',
        url: BASE_URL + '/users',
        headers: {},
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
};

app();
