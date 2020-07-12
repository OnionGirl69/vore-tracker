// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// Creates the map of words and dates
const serverMap = new Map();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    //forbids a word
    if(message.content.startsWith('r!forbid') and message.author.server_permissions.administrator) {
        let forbidden = message.content.substring(8).trim();
        let guild = message.guild.id.toString();
        let keyMix = guild.concat(forbidden);
        let key = keyMix.toLowerCase();
        let today = new Date(Date.now());

        if(!serverMap.has(key)){
            serverMap.set(key, today);
            message.channel.send('Okay, "'.concat(forbidden).concat('" is now a forbidden word.'));
        }
        else{
            message.channel.send('You\'ve already forbidden that word!');
        }

    }
    //unforbids a word
    else if (message.content.startsWith('r!unforbid') and message.author.server_permissions.administrator) {
        let forbidden = message.content.substring(10).trim();
        let guild = message.guild.id.toString();
        let keyMix = guild.concat(forbidden);
        let key = keyMix.toLowerCase();

        if(!serverMap.has(key)){
            message.channel.send('You haven\'t forbidden this word!');
        }
        else{
            serverMap.delete(key);
            message.channel.send('Okay, "'.concat(forbidden).concat('" is no longer a forbidden word.'));
        }
    }
    //watches messages for forbidden word usage and responds if they're used
    else {
        for( let word of message.content.split(' ')){
            let guild = message.guild.id.toString();
            let keyMix = guild.concat(word);
            let key = keyMix.toLowerCase();
            if(serverMap.has(key)) {
                let then = serverMap.get(key);
                let now = new Date(Date.now());

                serverMap.delete(key);
                serverMap.set(key, now);

                let yearDiff = (now.getFullYear() - then.getFullYear());
                let monthDiff = ((now.getMonth() + ( yearDiff * 12 ) ) - then.getMonth());
                let dayDiff = ((now.getDate() + ( monthDiff * 30 ) ) - then.getDate());
                let hourDiff = ((now.getHours() + ( dayDiff * 24 ) ) - then.getHours());
                let minuteDiff = ((now.getMinutes() + ( hourDiff * 60 ) ) - then.getMinutes());
                let secondDiff = ((now.getSeconds() + ( minuteDiff * 60 ) ) - then.getSeconds());

                let responseString = 'You just said a forbidden word! It had been ';

                if(hourDiff >= 24){
                    responseString = responseString.concat(dayDiff.toString()).concat(' day(s) since someone last mentioned ');
                }
                else if(minuteDiff >= 60){
                    responseString = responseString.concat(hourDiff.toString()).concat(' hour(s) since someone last mentioned ');
                }
                else if(secondDiff >= 60){
                    responseString = responseString.concat(minuteDiff.toString()).concat(' minute(s) since someone last mentioned ');
                }
                else{
                    responseString = responseString.concat(secondDiff.toString()).concat(' second(s) since someone last mentioned ');
                }
                responseString = responseString.concat(word).concat('. Way to break the streak!');

                message.channel.send(responseString);
                break;
            }
        }
    }
});

//logs into the bot using the bot token. MUST BE CHANGED IF YOU USE THIS YOURSELF, UNLESS YOU ARE ALSO USING HEROKU AND ALSO SET THIS UP!
client.login(process.env.BOT_TOKEN);

