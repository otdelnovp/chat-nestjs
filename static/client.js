const app = () => {
  const socket = io('http://localhost:3444');
  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.messages-list');
  const sendBtn = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');
  const messages = [];

  const getMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:3444/api/chat');

      renderMessages(data);

      data.forEach(item => messages.push(item));
    } catch (error) {
      console.log(error.message);
    }
  };

  // getMessages();

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
        url: 'http://localhost:3444/api/users',
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
