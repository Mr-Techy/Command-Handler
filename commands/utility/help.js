const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'help',
	description: 'Gives all the commands of the bot.',
	aliases: ['cmds', 'commands'],
	run: async (client, message, args) => {
		if (!args[0]) {
			let categories = [];

			fs.readdirSync(`./commands/`).forEach((dir) => {
				const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

				const cmds = commands.map((command) => {
					let file = require(`../../commands/${dir}/${command}`);

					if (!file.name) return "No name provided.";

					let name = file.name.replace('.js', '');

					return `\`${name}\``;
				});

				let data = new Object();

				function uppercase(input) {
					const word = input.split(1);
					let first = word[0].toUppercase();
					const rest = word[1];
					const output = `${first}${rest}`
					return output
				}

				data = {
					name: uppercase(dir),
					value: cmds.length === 0 ? "In progress." : cmds.join(' '),
				}

				categories.push(data);
			});

			const embed = new Discord.MessageEmbed()
				.setTitle('Commands')
				.setDescription(`Use \`${client.prefix}help\` followed by the command name to get more info on that command.`)
				.addFields(categories)
				.setColor('BLURPLE')
				.setTimestamp();
			return message.channel.send(embed);
		} else {
			const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

			if (!command) return message.channel.send(`That is not a valid command, to see all my commands, run \`${client.prefix}help\``);

			const embed = new MessageEmbed()
				.setTitle("Command Details:")
				.addField("PREFIX:", `\`${prefix}\``)
				.addField(
					"COMMAND:",
					command.name ? `\`${command.name}\`` : "No command name."
				)
				.addField(
					"ALIASES:",
					command.aliases
						? `\`${command.aliases.join("` `")}\``
						: "No aliases for this command."
				)
				.addField(
					"USAGE:",
					command.usage
						? `\`${prefix}${command.name} ${command.usage}\``
						: `\`${prefix}${command.name}\``
				)
				.addField(
					"DESCRIPTION:",
					command.description
						? command.description
						: "No description for this command."
				)
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp();
			return message.channel.send(embed);
		}
	}
}
