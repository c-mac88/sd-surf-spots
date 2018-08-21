/* eslint no-case-declarations:off */
const JOIN_ROOM = 'JOIN_ROOM';

const eventHandler = (socket, event) => {
  socket.emit('event:ack', event);
};

const actionHandler = (socket, action) => {
  const { type, payload } = action;

  switch (type) {
    case JOIN_ROOM:
      socket.join(payload, () => {
        socket.emit('roomJoined', true);
      });
      break;
    default:
      break;
  }
};

module.exports = {
  eventHandler,
  actionHandler
};
