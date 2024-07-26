
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const memesDir = './memes';
const sentMemesFile = './sentMemes.json';

let sentMemes = [];
if (fs.existsSync(sentMemesFile)) {
    sentMemes = JSON.parse(fs.readFileSync(sentMemesFile));
}

const getImages = () => fs.readdirSync(memesDir).map(file => path.join(memesDir, file));

const sendRandomImage = async (channel) => {
    const images = getImages();
    const availableImages = images.filter(img => !sentMemes.includes(img));
    
    if (availableImages.length === 0) {
        channel.send('pasensya na tropa wala pang memes na bago hehe');
        return;
    }

    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    await channel.send({ files: [randomImage] });

    // Mark the image as sent
    sentMemes.push(randomImage);
    fs.writeFileSync(sentMemesFile, JSON.stringify(sentMemes, null, 2));
};

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async (message) => {
    if (message.content === '/ph') {
        await sendRandomImage(message.channel);
    }
});

client.login('YOUR_DISCORD_BOT_TOKEN_HERE');
