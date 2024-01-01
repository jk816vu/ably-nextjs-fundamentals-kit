// services/roomService.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
	log: ["query", "info", "warn"],
});

export async function createRoom() {
	try {
		const room_number = generateRandomRoomNumber();

		const createdRoom = await prisma.room.create({
			data: {
				room_number: room_number,
				name: "Your Room Name",
				description: "Your description will be here",
				queue: "",
			},
		});

		return createdRoom;
	} catch (error) {
		console.error("Error creating room:", error);
		throw error;
	}
}

export async function connectToRoom(room_number) {
	try {
		const room = await prisma.room.findUnique({
			where: { room_number },
		});

		if (room) {
			return room;
		} else {
			console.log("room not found");
			throw new Error("Room not found");
		}
	} catch (error) {
		console.error("Error connecting to room:", error);
		throw error;
	}
}

export async function publishFromClient(channel, eventName, message) {
	try {
		await channel.publish(eventName, message);
	} catch (error) {
		console.error("Error publishing message:", error);
		throw error;
	}
}

export function generateRandomRoomCode(length = 6) {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
}

export function generateRandomRoomNumber() {
	return Math.floor(Math.random() * 100000) + 1;
}

export async function getRoomNumberFromDatabase(room_number) {
	try {
		const room = await prisma.room.findUnique({
			where: { room_number },
		});

		if (room) {
			return room.room_number;
		} else {
			throw new Error("Room not found");
		}
	} catch (error) {
		console.error("Error getting room number from database:", error);
		throw error;
	}
}

export async function getRoomByCode(room_number) {
	try {
		const room = await prisma.room.findUnique({
			where: { room_number: parseInt(room_number, 10) },
		});

		return room;
	} catch (error) {
		console.error("Error getting room by code:", error);
		throw error;
	}
}

export async function findSong(keyword) {
	try {
		const songs = await prisma.song.findMany({
			where: {
				name: {
					contains: keyword,
				},
			},
			take: 20,
		});
		return songs;
	} catch (error) {
		console.error("Error searching for songs:", error);
		throw error;
	}
}

export async function addToQueue(roomID, songId) {
	try {
		// if (songId === null) { //TODO
		// 	console.log("songId is null");
		// 	return;
		// }

		const room = await prisma.room.findUnique({
			where: { room_number: parseInt(roomID) },
		});
		console.error("room", room);
		console.error("roomID", roomID);
		let queue = [];
		if (room.queue === null || room.queue === "") {
			console.error("queue is empty");
			queue.push(songId);
		} else {
			console.error("queue is not empty");
			queue = parseQueue(room.queue); // probably array i hope
			queue.push(songId);
		}

		return await prisma.room.update({
			where: { room_number: roomID },
			data: {
				queue: encodeQueue(queue),
			},
		});
	} catch (error) {
		console.error("Error adding to queue:", error);
		throw error;
	}
}

export async function retrieveQueue(room_number) {
	try {
		const room = await prisma.room.findUnique({
			where: { room_number: parseInt(room_number, 10) },
		});

		const queue = parseQueue(room.queue);

		return queue;
	} catch (error) {
		console.error("Error retrieving queue:", error);
		throw error;
	}
}

/* hopefully queue is array of song ids */
export async function getSongsFromQueue(queue) {
	try {
		if (!queue || !queue.length) {
			console.log("queue is empty");
			return [];
		}

		console.log("trying to getSongs From queue");
		console.log("queue", queue);

		// Parse each id to an integer
		const songIds = queue.map((id) => parseInt(id, 10));
		console.log("songIds", songIds);

		const songs = await prisma.song.findMany({
			where: {
				id: {
					in: songIds,
				},
			},
		});

		return songs;
	} catch (error) {
		console.error("Error getting songs from queue:", error);
		throw error;
	}
}

function parseQueue(str) {
	if (!str) {
		return [];
	}
	return str.split(":");
}

function encodeQueue(arr) {
	if (!arr) {
		return "";
	}
	return arr.join(":");
}
