require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const snoowrap = require('snoowrap');
const language = require('@google-cloud/language');
const testURI = process.env.MONGOURI;
const Bot = require('./models/Bot');
/*

const config = {
	client_id: process.env.client_id,
	client_secret: process.env.client_secret,
	username: process.env.username,
	password: process.env.password,
	user_agent: 'nwHacksModBot'
};

reddit = new snoowrap(config);
*/
const app = express();

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

connectDB();

function analyzeContents(body, bot) {


}

let bot = new Bot({});
bot.save().catch(err => {console.log(err)});
/*
const client = new language.LanguageServiceClient();
let subreddits = [];
let bots = Bot.find().then((doc) => {
    doc.forEach((bot) => {
        subreddits.push(bot.subreddit);
    })
});

// main
(async () => {
for (let bot of bots) {
    let comments = await reddit.getSubreddit(bot.subreddit).getNewComments({limit: 100});
    for (let comment of comments) {
        analyzeContents(comment.body, bot);
    }
}});

*/


// endpoints 

app.get('/getAll', async (req, res) => {
    let bots = await Bot.find();
    res.send(bots);
});


//
app.post('/postBot', async (req, res) => {
    let bot = new Bot({
        fakeNews: req.body.fakeNews,
        hateSpeech: req.body.hateSpeech,
        subreddit: req.body.subreddit,
        name: req.body.name
    });

    try {
        await bot.save();
        res.status(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/editBot', async (req, res) => {
    try {
        let bot = await Bot.findOne({name: req.body.name});
        for (attr in req.body.newAttributes) {
            bot[attr] = req.body.newAttributes[attr];
        }
        await bot.save();
        res.status(200).send(bot);

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }    
});

app.delete('/deleteBot', async (req, res) => {
    try {
        await Bot.deleteOne({name: req.body.name});
        res.status(200).send(`${req.body.name} deleted`);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});



// ----------------------------------------------------------------------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));