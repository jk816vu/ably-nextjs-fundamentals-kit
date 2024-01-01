const { PrismaClient } = require("@prisma/client");
const { songs } = require("./songs.js");
const prisma = new PrismaClient();

const load = async () => {
	try {
		await prisma.SelectedSong.deleteMany();
		console.log("Deleted records in SelectedSong table");

		await prisma.$queryRaw`ALTER TABLE SelectedSong AUTO_INCREMENT = 1`;
		console.log("reset room auto increment to 1");

		// await prisma.$queryRaw`ALTER TABLE Message AUTO_INCREMENT = 1`;
		// console.log("reset message auto increment to 1");

		// await prisma.songs.createMany({
		// 	data: songs,
		// });
		// console.log("Added songs");
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
