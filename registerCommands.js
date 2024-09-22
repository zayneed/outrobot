const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'outro',
        description: 'Spielt outro.mp3 und kickt den User zum Drop',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Slash-Befehle werden registriert.');

        await rest.put(
            Routes.applicationGuildCommands('1286048521488961697', '1249991456374919229'), // Setze hier deine Bot-Client-ID und Guild-ID
            { body: commands }
        );

        console.log('Slash-Befehle erfolgreich registriert.');
    } catch (error) {
        console.error(error);
    }
})();

