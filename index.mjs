import { Client, Intents} from 'discord.js'
console.log(Client);

//fetch will be used to call the API
import fetch from 'node-fetch';

console.log(fetch);

const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
}); 

const sad_words = [
  "sad", "depressed", "unhappy", "angry", "dispirited", "dejected", "glum", "gloomy", "desolate", "down"
];

const encours = [
  "Cheer up!",
  "Hang in there!",
  "You are a great person/bot!"
];

//this function fetches and returns the quote from the provided URL
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    //after the info is fetched, 
    //asynchronous call (which allows the function to wait until the data is retrieved "then" it's going to do smth w/ that data)
    .then(res => {//'res' callback function
      return res.json()
    })
    .then(data => {//custom formating
      return data[0]["q"] + " -" + data[0]["a"]
      //q is for quote & a is for author
    })
};

client.on("ready", () => {
  console.log('Logged in as ' + client.user.tag + '!')
});

client.on("message", msg => {

  //rite of passage from C... it's enough to make a grown man cry
  if (msg.content === "Hello") {
    msg.reply("World!")
  }

  //check if the message is from the bot so it doesn't reply to itself
  if (msg.author.bot) return

  if (msg.content === "+bestow") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  if (sad_words.some(word => msg.content.includes(word))) {
    const encour = encours [Math.floor(Math.random() * encours.length)]
    msg.reply(encour)
  }
});

///process.env is used to access my environment variable
client.login(process.env.TOKEN);