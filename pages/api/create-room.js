// pages/api/create-room.js

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			// Logic to generate a room code and save room details in the database
			const roomCode = generateRandomRoomCode(); // Implement your random code generation logic
			// Save the room details in the database (using Prisma, for example)

			res.status(200).json({ roomCode });
		} catch (error) {
			console.error("Error creating room:", error);
			res.status(500).json({ error: "Failed to create room" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}

function generateRandomRoomCode(length = 6) {
	const digits = "0123456789";
	let roomCode = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * digits.length);
		roomCode += digits.charAt(randomIndex);
	}

	return roomCode;
}
