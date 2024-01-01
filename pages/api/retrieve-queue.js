import { retrieveQueue, getSongsFromQueue } from "../../services/roomService";

export default async function handler(req, res) {
	console.log("attempting to retrieve queue in api");
	if (req.method === "GET") {
		const { roomId } = req.query;

		try {
			console.log("roomId", roomId);
			const queue = await retrieveQueue(roomId);
			const songs = await getSongsFromQueue(queue);

			res.status(200).json(songs);
		} catch (error) {
			console.error("Error searching for songs:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
