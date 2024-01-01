// pages/api/selected-songs.js

import { addToQueue } from "../../services/roomService";

export default async function handler(req, res) {
	console.log("attempting to add song to queue in api");
	if (req.method === "POST") {
		const { roomId, songId } = req.body;

		try {
			// Pass the order value to the addSongToQueue function
			const queueEntry = await addToQueue(roomId, songId);
			if (queueEntry === null) {
				res.status(200).json({ error: "Song already in queue" });
				return;
			}
			res.status(200).json(queueEntry);
		} catch (error) {
			console.error("Error adding song to the queue:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
