const express = require('express');
const mongoose = require('mongoose');
const snoowrap = require('snoowrap');
const language = require('@google-cloud/language');
const testURI = process.env.mongoURI;
const Bot = require('./models/Bot');

const config = {
	client_id: process.env.client_id,
	client_secret: process.env.client_secret,
	username: process.env.username,
	password: process.env.password,
	user_agent: 'nwHacksModBot'
};

reddit = new snoowrap(config);

const app = express();

connectDB();

const connectDB = async () => {
    try {
      await mongoose.connect(
        testURI,
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        },
      );
  
      console.log("MongoDB Connected...");
    } catch (err) {
      console.error(err.message);
      // Exit process with failure
      process.exit(1);
    }
  };


function analyzeContents(body, bot) {
    

}

const client = new language.LanguageServiceClient();
let subreddits = [];
let bots = Bot.find().then((doc) => {
    doc.forEach((bot) => {
        subreddits.push(bot.subreddit);
    })
});

// main

for (bot of bots) {
    let comments = await reddit.getSubreddit(bot.subreddit).getNewComments({limit: 100});
    for (comment of comments) {
        analyzeContents(comment.body, bot);
    }
}



// endpoints 

app.get('/getAll', (req, res) => {

})

app.post('/postBot', (req, res) => {
    
})

app.put('/editBot', (req, res) => {
    
})

app.delete('/deleteBot', (req, res) => {
    
})



// ----------------------------------------------------------------------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));