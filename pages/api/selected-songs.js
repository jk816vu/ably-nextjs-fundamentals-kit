// pages/api/selected-songs.js

import { addSongToQueue } from "../../services/roomService";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { roomId, songId, order } = req.body;

		try {
			// Pass the order value to the addSongToQueue function
			const queueEntry = await addSongToQueue(roomId, songId, order);
			res.status(200).json(queueEntry);
		} catch (error) {
			console.error("Error adding song to the queue:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
