const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections } = require("../websocket");

// index, show, store, update, destroy

module.exports = {
	async index(request, response) {
		const devs = await Dev.find();
		return response.json(devs);
	},

	async store(request, response) {
		const { github_username, techs, latitude, longitude } = request.body;
		let dev = await Dev.findOne({ github_username });

		if (!dev) {
			const apiResponse = await axios.get(
				`https://api.github.com/users/${github_username}`
			);
			const { name = login, avatar_url, bio } = apiResponse.data;
			const techsArray = parseStringAsArray(techs);

			const location = {
				type: "Point",
				coordinates: [longitude, latitude]
			};
			dev = await Dev.create({
				github_username,
				name,
				avatar_url,
				bio,
				techs: techsArray,
				location
			});

			// Filtrar as conexões que estão à, no máximo 10km de distância e que o novo dev tenha
			// pelo menos uma das tecnologias filtradas

			const sendSocketMessageTo = findConnections(
				{ latitude, longitude },
				techsArray
			);
			console.log(sendSocketMessageTo);
		}
		return response.json(dev);
	},

	async update() {
		// Atualizar um único Dev
		// Não deixar atualizar o github_username
	},

	async destroy() {
		// Deletar um Dev do bando de dados
	}
};
