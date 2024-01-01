const { Prisma } = require("@prisma/client");

const song = [
	{
		name: "A dze idzeš Helenko, Helenko",
		lyrics: "dajake prve slova",
		chords: "G D7 G C",
	},
	{
		name: "Na Kráľovej holi",
		lyrics: "dajake druhe slova",
		chords: "G D7 G C",
	},
	{
		name: "V pondelok doma nebudem",
		lyrics: "dajake tretie slova",
		chords: "G D7 G C",
	},
	{
		name: "Mamko moja komiňare idú",
		lyrics: "dajake štvrte slova",
		chords: "G D7 G C",
	},
	{
		name: "Á ja taká čárna",
		lyrics: "dajake piate slova",
		chords: "G D7 G C",
	},
];

module.exports = {
	song,
};
