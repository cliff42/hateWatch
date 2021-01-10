require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const snoowrap = require('snoowrap');
const language = require('@google-cloud/language');
const testURI = process.env.MONGOURI;
const Bot = require('./models/Bot');
const Comment = require('./models/Comment');
const cors = require('cors');
const automl = require('@google-cloud/automl');
const fs = require('fs');

// use this to keep track of bots without 
let allBots = {};

const config = {
	client_id: process.env.client_id,
	client_secret: process.env.client_secret,
	username: process.env.username,
	password: process.env.password,
	user_agent: 'nwHacksModBot'
};

reddit = new snoowrap(config);


const app = express();
app.use(cors());
app.use(bodyParser.json());

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://modBot:<password>@cluster0.xs8jt.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//********** */ 
// GCP AUTOML
//********** */

const automl_client = new automl.PredictionServiceClient();

//application/json" \
//https://automl.googleapis.com/v1/projects/893071275610/locations/us-central1/models/TCN5883893539531653120:predict \
//-//d @request.json

const modelFullId = automl_client.modelPath('893071275610', 'us-central1', 'TCN5883893539531653120');

// const testAutoML = async () => {
//     const test_string = 'is this hate text????'

//     try {
//         console.log("TESTING AUTOML")
//         const [automl_response] = await automl_client.predict({
//             name: modelFullId,
//             payload: {
//                 textSnippet: {
//                   content: test_string,
//                   mimeType: 'text/plain', // Types: 'test/plain', 'text/html'
//                 },
//               },
//         });
//         for (const annotationPayload of automl_response.payload) {
//             console.log(`Predicted class name: ${annotationPayload.displayName}`);
//             console.log(
//               `Predicted class score: ${annotationPayload.classification.score}`
//             );
//           }
//     } catch (err) {
//         console.log("AUTOML FAILED")
//         console.log(err)
//     }
// }

// testAutoML();


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

async function analyzeContents(comment, bot) {
// names of comment object properties obtained by logging comment objects from snoowrap requets
// example of how you would save a comment to db
/*
new Comment({
    body: comment.body,
    author: comment.author.name,
    redditID: comment.id,
    isHateSpeech: true/false,
    subreddit: subreddit.display_name
}).save();


*/


    let isHateSpeech = false;
    let certainty = 0;

    try {
        const [automl_response] = await automl_client.predict({
            name: modelFullId,
            payload: {
                textSnippet: {
                    content: comment.body, 
                    mimeType: 'text/plain', // Types: 'test/plain', 'text/html'
                },
            },
        });
        
        certainty = automl_response.payload[1].classification.score;
    } catch (err) {
        console.log(err)
    }

    if(certainty >= 0.5) {
        isHateSpeech = true;
    }
    new Comment({
        body: comment.body,
        author: comment.author.name,
        redditID: comment.id,
        isHateSpeech: isHateSpeech,
        certainty: certainty,
        subreddit: comment.subreddit.display_name,
    }).save().catch(err => {
        console.error(err);
    });
}


const client = new language.LanguageServiceClient();





/*
for (let bot of bots) {
    allBots[bot._id] = bot;
}
*/

// main

commentsSeen = {};

async function runBots() {
    //console.log('looping');
    
    let bots = await Bot.find();
    for (let bot of bots) {
        try {
            let comments = await reddit.getSubreddit(bot.subreddit).getNewComments({limit: 100});
            for (let comment of comments) {
                if (commentsSeen[comment.id] === undefined) {
                    // put logic in here to prevent redundant computations
                    analyzeContents(comment, bot);                    
                }
            };
        } catch (err) {
            console.error(err);
        }
    }
    
}

async function main() {
    comments = await Comment.find();
    for (comment of comments) {
        commentsSeen[comment.redditID] = comment;
    }
    setInterval(runBots, 5000);
};

// main();




// endpoints 

app.get('/getAll', async (req, res) => {
    let bots = await Bot.find();
    res.send(bots);
});


/*body example
    {"name": "test1",
    "subreddit": "blah",
    "fakeNews": "true",
    "hateSpeech": "true",
    "subreddit": "test"}
*/
app.post('/postBot', async (req, res) => {
    let bot = new Bot({
        fakeNews: req.body.fakeNews,
        hateSpeech: req.body.hateSpeech,
        subreddit: req.body.subreddit,
        name: req.body.name,
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


/*body example
    {"name": "test1",
    "newAttributes": {"fakeNews": "true",
    "hateSpeech": "true",
    "subreddit": "EDIT_TEST"}}
*/
app.put('/editBot', async (req, res) => {
    console.log('EDIT REQ: ' + req.body.name)
    try {
        let bot = await Bot.findOne({name: req.body.name});
        for (attr in req.body.newAttributes) {
            bot[attr] = req.body.newAttributes[attr];
        }
        // changing name to an existing name should cause save error
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

app.get('/getHateComments', async (req, res) => {
    try {
        hateComments = await Comment.find({subreddit: req.body.subreddit,
                                            isHateSpeech: true});
        res.status(200).send(hateComments);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/getComments', async (req, res) => {
    try {
        hateComments = await Comment.find({subreddit: req.body.subreddit});
        res.status(200).send(hateComments);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/getAllComments', async (req, res) => {
    try {
        let comments = await Comment.find();
        res.status(200).send(comments);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


// ----------------------------------------------------------------------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));