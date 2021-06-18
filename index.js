const mongoClient = require('mongodb').MongoClient;

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


//const url = 'mongodb+srv://karim:karim@development.xe4gk.mongodb.net/movie-app?retryWrites=true&w=majority';
const url =process.env.M_ENV;
const dbname = "movie-app";
const collectionName = "movies";
const port=3000; 
let client ="";


const app = express();

const connectToDB = async() =>{
    client = await mongoClient.connect(url);
    console.log("Connected to database");
}

app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.json({message:"Server is up..."});
    });


app.get("/movieList",async(req,res)=>{
    const collection = client.db(dbname).collection(collectionName);
    const response = await collection.find().toArray();
    res.json({response});
});

app.post("/addMovie",async(req,res)=>{
    const {name,year,length,actor} = req.body;
    const collection = client.db(dbname).collection(collectionName);
    const insert = await collection.insertMany([{ 
                name:name,
                year:year,
                length:length,
                actor:actor
            }])
    res.json(insert.result);
});

app.put("/updateMovie/:name",async(req,res)=>{
    const { name:movieName } = req.params;
    const year = req.body.year;
    const collection = client.db(dbname).collection(collectionName);

    const response = await collection.updateOne(
        { name: movieName },
        {
            $set: {
                year : year
            }
        }
    );
    res.json(response.result);
});

app.delete("/deleteMovie/:name",async(req,res)=>{
    const { name:movieName } = req.params;
    
    const collection = client.db(dbname).collection(collectionName);

    const response = await collection.deleteOne({ name: movieName });
    res.json(response.result);
});

// app.get("/actorAnalytics",async(req,res)=>{
    
//     const collection = client.db(dbname).collection(collectionName);

//     const response = await collection.aggregate([
//         {
//            $group:{
//               ActorName:"$actor",
//               runningTime:{"$sum":"$length"},
//               totalMoviesOfActor:{"$sum":1}
//            }
//         }])
//     res.json(response.result);
// });





connectToDB();
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  