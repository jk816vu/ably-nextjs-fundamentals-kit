const { PrismaClient } = require("@prisma/client");
const { songs } = require("./songs.js");
const prisma = new PrismaClient();

const load = async () => {
	try {
		await prisma.songs.deleteMany();
		console.log("Deleted records in song table");

		await prisma.$queryRaw`ALTER TABLE Songs AUTO_INCREMENT = 1`;
		console.log("reset room auto increment to 1");

		// await prisma.$queryRaw`ALTER TABLE Message AUTO_INCREMENT = 1`;
		// console.log("reset message auto increment to 1");

		await prisma.songs.createMany({
			data: songs,
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
