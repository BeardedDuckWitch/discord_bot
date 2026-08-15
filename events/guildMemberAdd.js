const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const roles = [member.guild.roles.cache.get('1279718324581826722'), member.guild.roles.cache.get('1537956393330540604')]
        const role = roles[Math.floor(Math.random() * 2)];

        if (!role) {
            console.log('Role not found!');
            return;
        }

        try {
            await member.roles.add(role);
            console.log(`Assigned ${role.name} to ${member.user.tag}`);
        } catch (error) {
            console.error('Failed to assign role:', error);
        }
    }
}