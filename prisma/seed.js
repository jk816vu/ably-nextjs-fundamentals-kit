const { PrismaClient } = require("@prisma/client");
const { messages, rooms } = require("./data.js");
const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.room.deleteMany();
    console.log("Deleted records in room table");

    await prisma.message.deleteMany();
    console.log("Deleted records in message table");

    await prisma.$queryRaw`ALTER TABLE Room AUTO_INCREMENT = 1`;
    console.log("reset room auto increment to 1");

    await prisma.$queryRaw`ALTER TABLE Message AUTO_INCREMENT = 1`;
    console.log("reset message auto increment to 1");

    await prisma.room.createMany({
      data: rooms,
    });
    console.log("Added room data");

    await prisma.message.createMany({
      data: messages,
    });
    console.log("Added message data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();

// npx prisma db push
// npm run seed
