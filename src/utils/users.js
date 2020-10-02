const users = [];

// addUser,removeUser,getUser,getUserInRoom
const addUser = ({ id, username, room }) => {
  // CLean data

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate Data
  if (!username || !room) {
    return {
      error: 'Username and room are required',
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use',
    };
  }

  // store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => {
    if (user.id === id) {
      return user;
    }
  });
  return user;
};

const getUsersInRoom = (room) => {
  const userInRoom = users.filter((user) => user.room === room);
  return userInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
