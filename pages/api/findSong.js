const findSong = async (name) => {
	const song = await prisma.songs.findUnique({
		where: {
			name: name,
		},
	});
	return song;
};
