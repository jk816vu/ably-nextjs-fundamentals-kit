// services/roomService.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
	log: ["query", "info", "warn"],
});

export async function createRoom() {
	console.log("inside creating room");
	try {
		console.log("inside creating room try");
		const room_number = generateRandomRoomNumber();
		console.log("room_number", room_number);

		const createdRoom = await prisma.room.create({
			data: {
				room_number: room_number,
				name: "Your Room Name",
				description: "Your description will be here",
			},
		});

		console.log("createdRoom after this text");
		console.log("createdRoom with value ", createdRoom);

		return createdRoom;
	} catch (error) {
		console.error("Error creating room:", error);
		throw error;
	}
}

export async function connectToRoom(room_number) {
	try {
		console.log("inside connectToRoom");
		const room = await prisma.room.findUnique({
			where: { room_number },
		});

		if (room) {
			console.log("found room", room);
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
