module.exports = {
	name: 'ping',
	description: 'Pong!',
	aliases: ['p', 'status'],
	run: async (client, message, args) => {
		message.channel.send('Pinging the bot...').then(msg => {
			msg.edit(`WebSocket: \`${client.ws.ping}\`\nResponse ping: \`${msg.createdAt - message.createdAt}ms\``);
		});
	}
}
