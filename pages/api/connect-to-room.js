// pages/api/connect-to-room.js

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const { roomCode } = req.body;

			// Logic to connect to the specified room using the room code
			// Fetch room details from the database using the room code

			res.status(200).json({ success: true, roomCode });
		} catch (error) {
			console.error("Error connecting to room:", error);
			res.status(500).json({ error: "Failed to connect to room" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
