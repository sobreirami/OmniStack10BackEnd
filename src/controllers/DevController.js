const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {

        const { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne({ github_username });

        if(!dev) {

            const responseGithub = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = responseGithub.data;
            
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return response.json(dev);
    },

    async update(request, response) {
        const github_username = request.params.github_username;

        let dev = await Dev.findOne({ github_username });

        if(dev) {

            const { 
                techs = dev.techs, 
                name = dev.name, 
                avatar_url = dev.avatar_url, 
                bio = dev.bio, 
                latitude = dev.location.coordinates[1], 
                longitude = dev.location.coordinates[0]
            } = request.body;
            
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ],
            };

            dev = await Dev.update({
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
            
        }

        return response.json(dev);

    },

    async destroy(request, response) {

        const github_username = request.params.github_username;

        let dev = await Dev.findOne({ github_username });

        if(dev) {
            dev.deleteOne();
        }

        return response.json(dev);
    },

};