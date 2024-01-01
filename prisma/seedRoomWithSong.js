const { PrismaClient } = require("@prisma/client");
const { song } = require("./song.js");
const prisma = new PrismaClient();

const load = async () => {
	try {
		await prisma.room.create({
			data: {
				room_number: 123456,
				name: "Your Room Name",
				description: "Your description will be here",
				queue: "1",
			},
		});
		console.log("Added songs");
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
