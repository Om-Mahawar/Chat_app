const socket = io();

const button = document.querySelector('#send');
const locationBtn = document.querySelector('#send-location');
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  // New message element
  const newMessage = messages.lastElementChild;

  // Height of last message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  // height of messages container
  const containerHeight = messages.scrollHeight;

  // How far have i scrolled
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }

  console.log(newMessageMargin);
};

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  sidebar.innerHTML = html;
});

button.addEventListener('click', (e) => {
  e.preventDefault();
  //disable
  button.setAttribute('disabled', 'disabled');
  let input = document.querySelector('#smessage');

  socket.emit('sendMessage', input.value, (error) => {
    button.removeAttribute('disabled');
    input.value = '';
    input.focus();
    //ENABLE

    if (error) {
      return console.log(error);
    }

    console.log('Message Delivered');
  });
});

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  //Disable
  locationBtn.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (message) => {
        //enable
        console.log(message);
        locationBtn.removeAttribute('disabled');
      }
    );
  });
});

socket.emit(
  'join',
  {
    username,
    room,
  },
  (error) => {
    if (error) {
      alert(error);
      location.href = '/';
    }
  }
);
