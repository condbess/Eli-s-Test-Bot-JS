const { Client, Intents } = require("discord.js");
//fetch will be used to call the API
const fetch = import("node-fetch");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

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

});

client.on("message", msg => {

  //rite of passage from C... it's enough to make a grown man cry
  if (msg.content === "Hello") {
    msg.reply("World!")
  }

  //check if the message is from the bot so it doesn't reply to itself
  if (msg.author.bot) return

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }
});

///process.env is used to access my environment variable
client.login(process.env.TOKEN);

