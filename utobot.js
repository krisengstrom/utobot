//Dependencies
const Discord = require("discord.js");
const math = require('mathjs');
const config = require("./config.json");

//Init client
const client = new Discord.Client();

client.on("ready", () => {
	console.log("Listening...");
});

client.on("message", (message) => {

	//Halt on no prefix
	if (!message.content.startsWith(config.prefix) || message.author.bot)
		return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	//Ping command
	if (command == 'ping') {
		message.channel.send('pong!');
	}

	//Calculate ambush
	if (command == 'ambush') {
		//Raw Offense Required = [(Target's Elites sent*Racial Elite Defense Value) + (Target's Offspecs Sent*Racial Defspec Value) + (Target's Soldiers sent*Racial Soldier Defense Value)] * 0.8
		let [race, elites, specs, soldiers] = args;
		console.log(race);
		console.log(elites);
		console.log(specs);
		console.log(soldiers);
		
		var rawOff = Math.ceil(((config.units[race].elite.defense * elites) + (config.units[race].offspec * specs) + (soldiers * 1)) * 0.8);

		message.channel.send('You will need '+ rawOff +' offense points to succeed. Remember, this is the RAW offense required - therefore, don\'t bother sending more than 1 general, they have no effect!.');
	}

	//Return current Utopia time
	if (command == 'time') {
		message.channel.send('Apr 7, YR10');
	}

	//Evaluate and solve mathematical expression
	if (command == 'calc') {
		message.channel.send(math.eval(args.join(' ')));
	}

	//Insult user
	if (command == 'insult') {

		console.log(args[0]);
		args[0].replace('@', '');
		console.log(args[0].replace('@', '').split('#'));

		var recipient = client.users.find(function(user) {

			if (args[0].indexOf('#') > -1) {
				let [username, discriminator] = args[0].replace('@', '').split('#');
				if (user.username == username && user.discriminator == discriminator) {
					return true;
				}
				return false;
			} else {
				return ('<@'+user.id+'>' == args[0]);
			}
			return false;
		});

		if (!recipient)
			return;

		var insults = [
			'%s, did your parents ever ask you to run away from home?',
			'If I had a face like %s\'s I’d sue my parents.',
			'Keep talking %s – someday you’ll say something intelligent.',
			'%s is so ugly that when their mother dropped them off at school she got a fine for littering.',
			'%s, I\'m not saying I hate you, but I would unplug your life support to charge my phone.',
			'Sorry, I won\'t do it. %s is too fragile to handle it.',
			'%s, your face looks like you\'ve been using it as a doorstop.',
			'I love what you\'ve done with your hair, %s. How do you get it to come out of the nostrils like that?',
			'%s, it looks like your face caught on fire and someone tried to put it out with an ice pick.',
			'%s is so fat they could sell shade.',
			'Did you know they used to be called "Jumpolines" until %s\'s mum jumped on one?',
			'%s is so ugly when they look in the mirror, their reflection looks away.',
			'I\'d slap you %s, but that would be animal abuse.',
			'%s, you\'re about as useful as Anne Frank\'s drumset.',
			'People like %s are the reason God doesn\'t talk to us anymore.',
			'%s reminds me of Rapunzel, except instead of letting down their hair they let down everyone in their life',
			'%s, you look like your father would be disappointed in you. If he stayed.',
			'%s, you\'re so dense, light bends around you.',
			'If the Catholic Church ever met %s, they would start promoting abortions.',
			'if i was in a room with %s, Osama Bin Laden and Hitler, and i had a gun with two bullets in it, I\'d shoot %s twice.',
		]
		var insult = insults[Math.floor(Math.random()*insults.length)];
		message.channel.send(insult.replace('%s', '<@'+recipient.id+'>'));
	}

	//Look up spell
	if (command == 'spell') {
		for (let spell of config.spells) {
			if (uniformString(spell.name).indexOf(uniformString(args.join(' '))) > -1) {
				console.log('Looking up ' + uniformString(spell.name));
				message.channel.send(spell.name + "\n" + spell.description + "\n\n" + 'Available to: ' + spell.available_to + "\n" + 'Effect: ' + spell.effect + "\n" + 'Duration: ' + spell.duration);
				return;
			}

		}
	}

});

function uniformString(str) {
	str = str.toLowerCase();
	str = str.replace(/[^a-zA-Z ]+/, '');
	str = str.replace(/ +/, ' ');
	return str;
}

client.login(config.token);