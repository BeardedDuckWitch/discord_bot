const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.once(Events.ClientReady, async (client) => {
	const guild = client.guilds.cache.get(process.env.GUILD);

	let res = await guild.members.fetch();

	for (const member of res.values()){
		if(member.roles.cache.has(process.env.ROLE1) || member.roles.cache.has(process.env.ROLE2) || member.roles.cache.has(process.env.ROLE_LEADER)){
			continue;
		}

		const roles = [member.guild.roles.cache.get(process.env.ROLE1), member.guild.roles.cache.get(process.env.ROLE2)]
        const role = roles[Math.floor(Math.random() * 2)];
		try{
			await member.roles.add(role);
			console.log(`Assigned ${role.name} to ${member.user.tag}`);
		} catch (error){
			console.error(`Failed to assign role to ${member.user.tag}:`, error);
		}
	}
	console.log("Finished checking all the members");
})
client.login(process.env.DISCORD_TOKEN);