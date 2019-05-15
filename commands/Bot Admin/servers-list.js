const Command = require("../../base/Command.js"),
Discord = require("discord.js");

class ServersList extends Command {

    constructor (client) {
        super(client, {
            name: "servers-list",
            description: (language) => language.get("SERVERSLIST_DESCRIPTION"),
            usage: "servers-list",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            examples: "$servers-list",
            adminOnly: true
        });
    }

    async run (message, args, utils) {
    
        var i0 = 0;
        var i1 = 10;
        var page = 1;

        var embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setColor(utils.embed.color)
            .setFooter(this.client.user.username)
            .setTitle(message.language.get('PAGE')+": "+page+"/"+Math.ceil(this.client.guilds.size/10))
            .setDescription(message.language.get('TOTAL_SERVERS')+" : "+this.client.guilds.size+"\n\n"+this.client.guilds.sort((a,b)=>b.memberCount-a.memberCount).map(r=>r).map((r, i) => "**"+i + 1+"** - "+r.name.toString()+" | "+r.memberCount+" :busts_in_silhouette: | `"+r.id+"`").slice(0, 10).join("\n"));

        const tdata = await message.channel.send(embed);
        
        await tdata.react("⬅");
        await tdata.react("➡");
        await tdata.react("❌");

        const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

        var timeOut = setTimeout(function(){
            data_res.stop();
        }, 60000);

        data_res.on('collect', async(reaction) => {

            if(reaction._emoji.name === `⬅`) {

                // Updates variables
                i0 = i0-10;
                i1 = i1-10;
                page = page-1;
                
                // if there is no guild to display, delete the message
                if(i0 < 0) return await reaction.remove(message.author.id);
                if(!i0 || !i1) return await reaction.remove(message.author.id);

                // Update the embed with new informations
                embed.setTitle(message.language.get('PAGE')+": "+page+"/"+Math.round(this.client.guilds.size/10))
                .setDescription(message.language.get('TOTAL_SERVERS')+" : "+this.client.guilds.size+"\n\n"+this.client.guilds.sort((a,b)=>b.memberCount-a.memberCount).map(r=>r).map((r, i) => "**"+i + 1+"** - "+r.name.toString()+" | "+r.memberCount+" :busts_in_silhouette: | `"+r.id+"`").slice(i0, i1).join("\n"));
            
                // Edit the message 
                tdata.edit(embed);
            
            };

            if(reaction._emoji.name === "➡"){

                // Updates variables
                i0 = i0+10;
                i1 = i1+10;
                page = page+1;

                // if there is no guild to display, delete the message
                if(i1 > this.client.guilds.size + 10) return await reaction.remove(message.author.id);
                if(!i0 || !i1) return await reaction.remove(message.author.id);

                // Update the embed with new informations
                embed.setTitle(message.language.get('PAGE')+": "+page+"/"+Math.round(this.client.guilds.size/10))
                .setDescription(message.language.get('TOTAL_SERVERS')+" : "+this.client.guilds.size+"\n\n"+this.client.guilds.sort((a,b)=>b.memberCount-a.memberCount).map(r=>r).map((r, i) => "**"+i + 1+"** - "+r.name.toString()+" | "+r.memberCount+" :busts_in_silhouette: | `"+r.id+"`").slice(i0, i1).join("\n"));
             
                // Edit the message 
                tdata.edit(embed);

            };

            if(reaction._emoji.name === "❌"){
                data_res.stop();
            }

            // Remove the reaction when the user react to the message
            await reaction.remove(message.author.id);

        });
        

        data_res.on('end', () => {
            tdata.clearReactions();
            embed.setTitle('');
            embed.setDescription(message.language.get("SERVERSLIST_TIMEOUT"));
            tdata.edit(embed);
        });

        
    }

}

module.exports = ServersList;