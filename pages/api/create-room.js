// pages/api/create-room.js

import { createRoom } from "../services/roomService";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			console.log("maybe this ? ");
			const createdRoom = await createRoom();
			res.status(200).json(createdRoom);
		} catch (error) {
			res.status(500).json({ error: "Error creating room" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
