const { Prisma } = require("@prisma/client");

const rooms = [
  {
    name: "Room1",
    description: "First room that was created",
    room_number: 123546,
  },
  {
    name: "Room2",
    description: "Second room that was created",
    room_number: 621457,
  },
  {
    name: "Room3",
    description: "Third room that was created",
    room_number: 998573,
  },
];

const messages = [
  {
    message: "First message in room number 1",
    room_id: 1,
  },
  {
    message: "First message in room number 3",
    room_id: 3,
  },
  {
    message: "First message in room number 2",
    room_id: 2,
  },
  {
    message: "Second message in room number 1",
    room_id: 1,
  },
  {
    message: "Second message in room number 2",
    room_id: 2,
  },
];

module.exports = {
  messages,
  rooms,
};
