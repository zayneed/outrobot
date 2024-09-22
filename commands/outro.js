const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('outro')
        .setDescription('Spielt outro.mp3 und kickt den User zum Drop'),
    async execute(interaction) {
        const user = interaction.member;
        const channel = user.voice.channel;
        if (!channel) {
            return interaction.reply('Du musst in einem Voice-Channel sein, um diesen Befehl zu verwenden.');
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        // Audio-Player und Ressource vorbereiten
        const player = createAudioPlayer();
        const resource = createAudioResource(fs.createReadStream('./outro.mp3'));

        connection.subscribe(player);
        player.play(resource);

        await interaction.reply('Outro wird abgespielt!');

        // Kicke den User zur angegebenen Zeit
        setTimeout(() => {
            const chance = Math.random(); // Zufallszahl zwischen 0 und 1

            if (chance <= 0.15) {
                // 5% Chance: Benutzer wird vom Server gekickt
                if (user.kickable) {
                    user.kick('Passender Drop-Kick (5% Chance)');
                    interaction.followUp({ content: `${user.displayName} wurde vom Server gekickt!` });
                }
            } else {
                // 95% Chance: Benutzer wird nur aus dem Voice-Channel gekickt
                if (user.voice.channel) { // Prüfe, ob der Benutzer in einem Voice-Channel ist
                    user.voice.disconnect('Passender Drop-Kick (95% Chance)');
                    interaction.followUp({ content: `${user.displayName} wurde aus dem Voice-Channel gekickt!` });
                } else {
                    interaction.followUp({ content: `${user.displayName} ist nicht mehr im Voice-Channel.` });
                }
            }
        }, 15 * 1000); // Timeout in Millisekunden

        // Bot verlässt den Channel, wenn das Lied zu Ende ist
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
    }
};
