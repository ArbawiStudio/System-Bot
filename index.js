const Express = require('express')
const App = Express()
const { Client, MessageEmbed } = require('discord.js')
const client = new Client()
const db = require('quick.db')
const chalk = require('chalk')
const { Prefix, RoomID } = require('./config')
const ms = require('ms')

client.on('ready', async() => {
    await console.log(chalk.blackBright(`[INFORMATION] :: ${client.user.username} is Ready!`))
    await client.user.setStatus('dnd')
    await client.user.setActivity(`${Prefix}help`, { type: 'WATCHING' })
    setInterval(async () => {
        const VoiceChannelClient = await client.channels.cache.get(RoomID)
        if(!VoiceChannelClient) return console.log('I Can\'t Find a Voice Channel!')
        VoiceChannelClient.join()
    }, 5000)
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'help')) {
        const EMBED = new MessageEmbed()
           .setDescription(``)
        TOBZiCoder.channel.send(EMBED)
    }
})

client.on('message', async TOBZiCoder => {
    const os = require('os')
    if(TOBZiCoder.content.startsWith(Prefix + 'bot')) {
        const { version } = require('./package.json')
        const Core = await os.cpus()[0]
        const EMBED = new MessageEmbed()
           .addField('**BOT NAME**', client.user.username, true)
           .addField('**BOT ID**', client.user.id, true)
           .addField('**GUILDS**', client.guilds.cache.size, true)
           .addField('**USERS**', client.users.cache.size, true)
           .addField('**CHANNELS**', client.channels.cache.size, true)
           .addField('**BOT DEVELOPER**', 'ArbawiStudio / TOBZi', true)
           .addField('**NODE.JS**', process.version, true)
           .addField('**VERISON**', `v${version}`, true)
           .addField('**PLATFORM**', process.platform, true)
           .addField('**CPU**', os.cpus().length, true)
           .addField('**CPU MODEL**', Core.model, true)
           .addField('**CPU SPEED**', `**${Core.speed}MHz**`, true)
        TOBZiCoder.channel.send(EMBED)
    }
})


client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'lock')) {

        if(!TOBZiCoder.member.hasPermission('MANAGE_CHANNELS')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)

        const CH = await TOBZiCoder.mentions.channels.first() || await TOBZiCoder.channel;

        CH.updateOverwrite(TOBZiCoder.guild.id, {
            SEND_MESSAGES: false
        })

        TOBZiCoder.channel.send(`:lock: **${CH} has been Locked!**`)

    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'unlock')) {

        if(!TOBZiCoder.member.hasPermission('MANAGE_CHANNELS')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)

        const CH = await TOBZiCoder.mentions.channels.first() || await TOBZiCoder.channel;

        CH.updateOverwrite(TOBZiCoder.guild.id, {
            SEND_MESSAGES: true
        })

        TOBZiCoder.channel.send(`:lock: **${CH} has been Locked!**`)

    }
})


client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'ban')) {
        if(!TOBZiCoder.member.hasPermission('BAN_MEMBERS')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)
        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        const user = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1]) || await TOBZiCoder.guild.members.cache.find(user => user.user.username === args.slice(1).join(' '))
        if(!user) return TOBZiCoder.channel.send(`Mention a User or Type User ID`)
        if(user.id === TOBZiCoder.author.id) return TOBZiCoder.channel.send(`You Can't Ban Yourself`)
        if(user.id === TOBZiCoder.guild.me.id) return TOBZiCoder.channel.send(`You Can't Kick Me`)
        if(!user.bannable) return TOBZiCoder.channel.send(`The Member Role is Higher them Me`)
        await user.ban({ reason: 'He/She just Got Banned' })
        TOBZiCoder.channel.send(`${user.user.username} has been Banned from Server.`)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'kick')) {
        if(!TOBZiCoder.member.hasPermission('KICK_MEMBERS')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)
        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        const user = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1])
        const reason = await args.slice(1).join(' ')
        if(!user) return TOBZiCoder.channel.send(`Mention a Member`)
        if(user.id === TOBZiCoder.author.id) return TOBZiCoder.channel.send(`You Can't Kick Yourself`)
        if(user.roles.highest.position >= TOBZiCoder.member.roles.highest.position && TOBZiCoder.author.id !== TOBZiCoder.guild.owner.id) return TOBZiCoder.channel.send(`:x: **| You Can't Kick this Member Due to Your Role Being Lower Than That Member Role.**`)
        if(user.kickable) {
            const EMBED = new MessageEmbed()
               .setColor()
               .setAuthor(TOBZiCoder.author.username, TOBZiCoder.author.displayAvatarURL({ dynamic: true }))
               .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
               .setDescription(`Member : **${user.user.username} (ID: ${user.user.id})**\nReason : **${reason || 'No Reason!'}**`)
            TOBZiCoder.channel.send(EMBED)
            user.kick()   
        } else {
            return TOBZiCoder.channel.send(`:x: **| You Can't Kick this Member Due to Your Role Being Lower Than That Member Role.**`)
        }
            return undefined;
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'setnick')) {
        if(!TOBZiCoder.member.hasPermission('CHANGE_NICKNAME')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)
        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        const user = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1]) || await TOBZiCoder.guild.members.cache.find(user => user.user.username === args.slice(1).join(' '))
        if(!user) return TOBZiCoder.channel.send(`Mention a User or Type User ID`)
        const nickname = await TOBZiCoder.content.split(' ').slice(2).join(' ')
        const members = await TOBZiCoder.guild.members.cache.get(user.id)

        if(!nickname) {
            members.setNickname(user.user.username)
        }
            members.setNickname(nickname)
        
        const OldNickname = await members.nickname || user.user.username;

        const EMBED = new MessageEmbed()
           .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
           .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
           .setDescription(`${TOBZiCoder.author} has been Changed Nickname of ${user.user}`)
           .addField('**Before**', `**${OldNickname}**`, true)
           .addField('**After**', `**${nickname}**`, true)
           .setFooter(`New Nickname by ${TOBZiCoder.author.username}`, TOBZiCoder.author.displayAvatarURL({ dynamic: true }))
        TOBZiCoder.channel.send(EMBED)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'channelinfo')) {
        const Channel = await TOBZiCoder.mentions.channels.first() || await TOBZiCoder.channel;
        const EMBED = new MessageEmbed()
           .setAuthor(TOBZiCoder.guild.name, TOBZiCoder.guild.iconURL())
           .setThumbnail(TOBZiCoder.author.displayAvatarURL({ dynamic: true }))
           .addField('**ID**', Channel.id, true)
           .addField('**NAME**', Channel.name, true)
           .addField('**TOPIC**', `\`\`\`diff\n+ ${Channel.topic || 'No Topic!'}\`\`\``)
           .addField('**CREATED ON**', `**<t:${parseInt(Channel.createdAt / 1000)}:f>**`, true)
           .addField('**MESSAGES SIZE**', `${Channel.messages.cache.size}`, true)
           .setFooter(`Requested by ${TOBZiCoder.author.tag}`, TOBZiCoder.author.displayAvatarURL({ dynamic: true }))
        TOBZiCoder.channel.send(EMBED)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'avatar')) {
        const args = await TOBZiCoder.content.split(' ').slice(1)
        if(args[0] === 'server') {
            const EMBED = new MessageEmbed()
               .setAuthor(TOBZiCoder.guild.name, TOBZiCoder.guild.iconURL())
               .setImage(TOBZiCoder.guild.iconURL({ dynamic: true, size: 4096 }))
               .setTitle('Avatar URL')
               .setURL(TOBZiCoder.guild.iconURL({ dynamic: true, size: 4096 }))
               .setFooter(`Requested by ${TOBZiCoder.author.tag}`, TOBZiCoder.author.displayAvatarURL({ dynamic: true }))
            TOBZiCoder.channel.send(EMBED)
        } else {
            const user = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1]) || await TOBZiCoder.guild.members.cache.find(user => user.user.id === args.slice(1).join(' ')) || await TOBZiCoder.author;
            const EMBED = new MessageEmbed()
               .setAuthor(user.user.tag, user.user.displayAvatarURL())
               .setImage(user.user.displayAvatarURL({ dynamic: true, size: 4096 }))
               .setTitle('Avatar URL')
               .setURL(TOBZiCoder.guild.iconURL({ dynamic: true, size: 4096 }))
               .setFooter(`Requested by ${TOBZiCoder.author.tag}`, TOBZiCoder.author.displayAvatarURL({ dynamic: true }))
            TOBZiCoder.channel.send(EMBED)
        }
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'temp-role')) {
        if(!TOBZiCoder.member.hasPermission('MANAGE_ROLES')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)
        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        const User = await TOBZiCoder.mentions.users.first() || await TOBZiCoder.guild.members.cache.get(args[1])
        if(!User) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please Mention a User/Type ID**`)
        const Role = await TOBZiCoder.mentions.roles.first() || await TOBZiCoder.guild.roles.cache.get(args[2])
        if(!Role) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please Mention a Role/Type ID**`)
        const Time = args[3];
        if(!Time) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please type a Time**`)
        TOBZiCoder.mentions.members.first().roles.add(Role)
        TOBZiCoder.channel.send(`**${Role} has been Added to ${User} for ${Time} Only**`)
        setTimeout(() => {
            TOBZiCoder.mentions.members.first().roles.remove(Role)
        }, ms(Time))
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'mute')) {
       if(!TOBZiCoder.member.hasPermission('MANAGE_GUILD')) return;
       const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
       const User = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1])
       if(!User) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please Mention a User/Type ID**`)
       const MuteRole = await db.get(`MuteRole_${TOBZiCoder.guild.id}`)
       const Mute = await TOBZiCoder.guild.roles.cache.find(Role => Role.id === MuteRole)
       if(User.roles.cache.has(Mute)) return TOBZiCoder.channel.send(`${TOBZiCoder.author}, This Member is Muted`)
       User.roles.add(Mute)
       TOBZiCoder.channel.send(`**${User.user.username} is Muted Now!**`)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'unmute')) {
        if(!TOBZiCoder.member.hasPermission('MANAGE_GUILD')) return;
        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        const User = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1])
        if(!User) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please Mention a User/Type ID**`)
        const MuteRole = await db.get(`MuteRole_${TOBZiCoder.guild.id}`)
        const Mute = await TOBZiCoder.guild.roles.cache.find(Role => Role.id === MuteRole)
        User.roles.remove(Mute)
        TOBZiCoder.channel.send(`**${User.user.username} is Unmuted Now!**`)
    }
})


client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'role-all')) {
        if(!TOBZiCoder.member.hasPermission('ADMINISTRATOR')) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, You Don't Have any Permission**`)
        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        const User = await TOBZiCoder.mentions.users.first() || await TOBZiCoder.guild.members.cache.get(args[1])
        if(!User) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please Mention a User/Type ID**`)
        const Role = await TOBZiCoder.mentions.roles.first() || await TOBZiCoder.guild.roles.cache.get(args[2])
        if(!Role) return TOBZiCoder.channel.send(`:x: **| ${TOBZiCoder.author.username}, Please Mention a Role/Type ID**`)
        TOBZiCoder.guild.members.cache.forEach(Members => Members.roles.add(Role))
        TOBZiCoder.channel.send(`**${Role} has been added to ${TOBZiCoder.guild.memberCount} Member**`)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'roles')) {
        let Roles = '```';
        let RoleName = await TOBZiCoder.guild.roles.cache.map(Role => Role.name)
        let Space = await RoleName.reduce((long, str) => Math.max(long, str.length), 0)
        TOBZiCoder.guild.roles.cache.forEach(ROLE => {
            Roles += `${ROLE.name}${' '.repeat(Space - ROLE.name.length)} : ${ROLE.members.size} Member\n`
        })
        Roles += '```';
        TOBZiCoder.channel.send(Roles)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'server')) {
        let verificationLevels = { NONE: '0', LOW: '1', MEDIUM: '2', HIGH: '3', VERY_HIGH: '4' }
        let text = TOBZiCoder.guild.channels.cache.filter(text => text.type === 'text').size;
        let voice = TOBZiCoder.guild.channels.cache.filter(voice => voice.type === 'voice').size;
        let Embed = new MessageEmbed()
           .setThumbnail(TOBZiCoder.guild.iconURL())
           .setColor('BLACK')
           .addField(':id: Server ID', TOBZiCoder.guild.id, true)
           .addField(':calendar: Created On', `**<t:${parseInt(TOBZiCoder.guild.createdAt / 1000)}:R>**`, true)
           .addField(':crown: Owned by', TOBZiCoder.guild.owner, true)
           .addField(`:busts_in_silhouette: Members (${TOBZiCoder.guild.memberCount})`, `**${TOBZiCoder.guild.members.cache.filter(users => ['dnd', 'online', 'idle'].includes(users.presence.status)).size}** Online\n**${TOBZiCoder.guild.premiumSubscriptionCount}** Boosts :sparkles:`, true)
           .addField(`:speech_balloon: Channels (${TOBZiCoder.guild.channels.cache.size})`, `**${text}** Text | **${voice}** Voice`, true)
           .addField(':earth_africa: Others',`**Verification Level:** ${verificationLevels[TOBZiCoder.guild.verificationLevel]}`, true)
           .addField(`:closed_lock_with_key: Roles (${TOBZiCoder.guild.roles.cache.size})`, `To see a list with all roles use **${Prefix}roles**`)
        TOBZiCoder.channel.send(Embed)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'vkick')) {
      if(!TOBZiCoder.channel.guild || TOBZiCoder.author.bot) return;
      const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
      const user = await TOBZiCoder.mentions.members.first() || await TOBZiCoder.guild.members.cache.get(args[1]) || await TOBZiCoder.guild.members.cache.find(user => user.user.id === args.slice(1).join(' '))
      if(!user) return;
      if(!TOBZiCoder.member.hasPermission('MOVE_MEMBERS')) return;
      if(user.id === TOBZiCoder.author.id) return TOBZiCoder.channel.send(`You Can't Kick Yourself`)
      if(!TOBZiCoder.guild.member(user).voice.channel) return TOBZiCoder.channel.send(`${user.user.username} has been not in Voice Channel`)
      await user.voice.kick()
      TOBZiCoder.channel.send(`${user.user} has been Successfully Kicked`)
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'set')) {
        const args = await TOBZiCoder.content.slice(1).split(' ')
        if(args[0] === 'colors') {

        await TOBZiCoder.guild.roles.create({ data: { name: '1',  color: '#FFB6C1', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '2',  color: '#FFC0CB', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '3',  color: '#FF69B4', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '4',  color: '#FF1493', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '5',  color: '#DB7093', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '6',  color: '#C71585', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '7',  color: '#E6E6FA', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '8',  color: '#D8BFD8', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '9',  color: '#DDA0DD', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '10', color: '#DA70D6', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '11', color: '#EE82EE', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '12', color: '#FF00FF', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '13', color: '#BA55D3', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '14', color: '#9932CC', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '15', color: '#9400D3', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '16', color: '#800080', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '17', color: '#7B68EE', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '18', color: '#9370DB', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '19', color: '#FFA07A', permissions: [] } })
        await TOBZiCoder.guild.roles.create({ data: { name: '20', color: '#FF0000', permissions: [] } })

        TOBZiCoder.channel.send(new MessageEmbed() .setDescription(`\`🕑\` **Preparing your Server Colors ...**`)).then(msg => {
            setTimeout(() => {
                msg.delete()
                msg.edit(new MessageEmbed() .setDescription(`\`✅\` **Your Colors is Ready**`))
            }, 30000)
        })

        } else if(args[0] === 'autorole') {
            if(!TOBZiCoder.member.hasPermission('ADMINISTRATOR')) return;
            const Role = await TOBZiCoder.mentions.roles.first()
            db.set(`AutoRole_${TOBZiCoder.guild.id}`, Role.id)
            TOBZiCoder.channel.send(`${ROLE} has been AutoRole Now!`)
        } else {
            TOBZiCoder.channel.send(`${Prefix}set colors/autorole`)
        }
    }
})

client.on('message', async TOBZiCoder => {
    if(TOBZiCoder.content.startsWith(Prefix + 'color')) {

        const args = await TOBZiCoder.content.slice(Prefix.length).trim().split(/ +/g)
        if(isNaN(args)) return TOBZiCoder.channel.send(new MessageEmbed() .setDescription(`\`❌\` Please Color Number.`))

        const Role = await TOBZiCoder.guild.roles.cache.find(role => role.name === args)
        if(!Role) return TOBZiCoder.channel.send(new MessageEmbed() .setDescription(`\`❌\` Please Type Wrong Color Number.`))

        TOBZiCoder.member.roles.cache.filter(role => !isNaN(role.name)).forEach(role => {
            TOBZiCoder.member.roles.remove(role)
        })

        if(TOBZiCoder.member.roles.cache.has(Role.id)) {
            TOBZiCoder.member.roles.remove(Role).then(() => {
                return TOBZiCoder.channel.send(new MessageEmbed() .setDescription(`\`✅\` Color has been Removed.`))
            })
        } else {
            TOBZiCoder.member.roles(Role).then(() => {
                return TOBZiCoder.channel.send(new MessageEmbed() .setDescription(`\`✅\` Color has been Changed Successfully.`))
            })
        }
    }
})

client.on('guildMemberAdd', async Member => {
    const Role = await db.get(`AutoRole_${Member.guild.id}`)
    if(!Role) return console.log(chalk.redBright(`I Can't Find AutoRole in ${Member.guild.name} (ID: ${Member.guild.id})`))
    Member.roles.add(Role)
})

client.login(process.env.TOKEN)
