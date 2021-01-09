const express = require('express');
const mongoose = require('mongoose');
const snoowrap = require('snoowrap');
const testURI = process.env.mongoURI;
const Bot = require('./models/Bot');

const config = {
	client_id: process.env.client_id,
	client_secret: process.env.client_secret,
	username: process.env.username,
	password: process.env.password,
	user_agent: 'nwHacksModBot'
};

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

subreddits = [];
bots = Bot.find().then((doc) => {
    doc.forEach((bot) => {
        subreddits.push(bot.subreddit);
    })
});



// main

for (subreddit of subreddits) {
    
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