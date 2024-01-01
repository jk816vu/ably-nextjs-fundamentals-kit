// pages/api/search-song.js

import { findSong } from "../../services/roomService";

export default async function handler(req, res) {
	if (req.method === "GET") {
		const { keyword } = req.query;

		try {
			const songs = await findSong(keyword);
			res.status(200).json(songs);
		} catch (error) {
			console.error("Error searching for songs:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
