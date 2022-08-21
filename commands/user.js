const { EmbedBuilder } = require("discord.js");
const { permissions } = require("../data.json");

module.exports = {
	data: {
		name: "user",
		description: "Get information about a failure.",
		permission: 0,
		arguments: ["failure"],
	},
	async execute(context, client, database) {
		let user;
		const mention = context.message.mentions.users.first();

		if (mention)
			user = {
				data: await database.User.getUser(
					mention.id,
					context.message.guild.id
				),
				discord: mention,
			};
		else
			user = {
				data: await database.User.getUser(
					context.message.author.id,
					context.message.guild.id
				),
				discord: context.message.author,
			};

		if (!user.data)
			return context.message.reply(
				`${user.discord.username}#${user.discord.discriminator} was not found.`
			);
		else {
			let hex;
			if (mention)
				hex = context.message.mentions.members.first().displayHexColor;
			else hex = context.message.member.displayHexColor;

			let avatar;
			if (mention)
				avatar = context.message.mentions.members
					.first()
					.displayAvatarURL();
			else avatar = context.message.member.displayAvatarURL();

			const embed = new EmbedBuilder()
				.setTitle("Failure Information")
				.setColor(hex)
				.setThumbnail(avatar)
				.addFields(
					{
						name: "User:",
						value: `${user.discord.username}#${user.discord.discriminator}`,
						inline: true,
					},
					{
						name: "Permission Name (Number):",
						value: `${permissions[user.data.permission].replaceAll(
							"_",
							" "
						)} (${user.data.permission})`,
						inline: true,
					},
					{
						name: "Level:",
						value: String(user.data.levels.level),
						inline: true,
					},
					{
						name: "XP:",
						value: `${String(user.data.levels.xp)}/${String(
							user.data.levels.xp_to_next_level
						)}`,
						inline: true,
					}
				)
				.setFooter({
					text: `This command was executed by ${context.message.author.username}#${context.message.author.discriminator}.`,
					icon_url: context.message.member.displayAvatarURL(),
				});

			return context.message.reply({
				embeds: [embed],
			});
		}
	},
};
