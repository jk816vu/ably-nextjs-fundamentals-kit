const { PrismaClient } = require("@prisma/client");
const { song } = require("./song.js");
const prisma = new PrismaClient();

const load = async () => {
	try {
		await prisma.song.deleteMany();
		console.log("Deleted records in song table");

		await prisma.$queryRaw`ALTER TABLE Song AUTO_INCREMENT = 1`;
		console.log("reset room auto increment to 1");

		// await prisma.$queryRaw`ALTER TABLE Message AUTO_INCREMENT = 1`;
		// console.log("reset message auto increment to 1");

		await prisma.song.createMany({
			data: song,
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
