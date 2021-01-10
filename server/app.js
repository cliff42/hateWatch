require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const snoowrap = require('snoowrap');
const language = require('@google-cloud/language');
const testURI = process.env.MONGOURI;
const Bot = require('./models/Bot');
const cors = require('cors');
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
app.use(cors());
app.use(bodyParser.json());


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

/*
const client = new language.LanguageServiceClient();

// main
async function runBots() {
    let bots = await Bot.find();
    for (let bot of bots) {
        let comments = await reddit.getSubreddit(bot.subreddit).getNewComments({limit: 100});
        for (let comment of comments) {
            analyzeContents(comment.body, bot);
        };
    }
}

function main() {
    setInterval(runBots, 30000);
};

main();

*/


// endpoints 

app.get('/getAll', async (req, res) => {
    let bots = await Bot.find();
    res.send(bots);
});


//
app.post('/postBot', async (req, res) => {
    let bot = new Bot({
        fakeNews: req.body.optionNews,
        hateSpeech: req.body.optionBody,
        subreddit: req.body.subreddit,
        name: req.body.name
    });
    console.log(bot);



    try {
        await bot.save();
        console.log('bot saved');
        res.status(200).send(bot);
    } catch (err) {
        console.error(err);
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