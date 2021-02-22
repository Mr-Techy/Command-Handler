const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const { prefix, token } = require('config.json');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync('./commands/');
client.prefix = prefix;

fs.readdirSync(`./commands/`).forEach(dir => {
	commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${dir}/${file}`);
		client.commands.set(command.name, command);
		client.aliases.set(command.aliases, command);
	};
});

client.once('ready', async () => {
	console.log(`${client.user.tag} has logged in.`);
});

client.on('message', async () => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const cmdName = args.shift().toLowerCase();

	const command = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));

	try {
		if (command) {
			command.run(client, message, args);
		}
	} catch (err) {
		console.error(err);
		message.channel.send(`There was an issue executing the ${cmdName} command. Error: \`${err}\``);
	}
})