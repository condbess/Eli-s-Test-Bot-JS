import { Client, Intents } from 'discord.js'
import fetch from 'node-fetch' //fetch will be used to call the API
import Database from '@replit/database'

//print statements are used to verify some imports
console.log(Client);
console.log(fetch);

const db = new Database();
const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
}); 

//array of sad words
const sad_words = [
  "sad", "depressed", "unhappy", "angry", "dispirited", "dejected", "glum", "gloomy", "desolate", "down", "test"
];

//array containing the frist encouragements
const initialEncours = [
  "Cheer up!",
  "Hang in there!",
  "You are a great person/bot!"
];

//replit database initialization and addition of the initialEncours to the db
db.get("encours").then(encours => {
  if (!encours || encours.length === 0) {
    db.set("encours", initialEncours)
  }
});

//this function adds the custom messages to the db
function updateEncours(encouringMsg) {
  db.get("encours").then(encours => {
    encours.push([encouringMsg])
    db.set("encours", encours)
  })
};

//this fuction deletes messages from the db
function deleteEncours(index) {
  db.get("encours").then(encours => {
    if (encours.length > index) { //check index validity
      encours.splice(index, 1)    //remove 1 item fro the provided index
      db.set("encours", encours)  //set db after msg deletion
    }
  })
};

//this function fetches and returns the quote from the provided URL
async function getQuote() {
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
  
  //if user text contains at least one sad word from the sad_words array, then reply w/ a randomly selected encour from the encour array
  if (sad_words.some(word => msg.content.includes(word))) {
    db.get("encours").then(encours => {
    const encour = encours [Math.floor(Math.random() * encours.length)]
    msg.reply(encour)  
    })
  }

  //'new' command for user to add an encouraging message
  if(msg.content.startsWith("+new")) {
    const encouringMsg = msg.content.split("+new ")[1] //split string method separates the message from the command string
    updateEncours(encouringMsg)
    msg.channel.send("New encouraging message added:thumbsup:")
  }

  //'del' command for user to add an encouraging message
  if(msg.content.startsWith("+del")) {
    const index = parseInt(msg.content.split("+del ")[1])
    const string = msg.content.split("+del ")[1]
    deleteEncours(index)
    msg.channel.send("New encouraging message, \"" + string + "\" deleted:pensive:")
  }
});

///process.env is used to access my environment variable
client.login(process.env.TOKEN);