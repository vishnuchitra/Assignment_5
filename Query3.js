import { MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017/';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function findUserMostTweets() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const agg = [
      { '$group': { '_id': '$user.screen_name', 'tweetCount': { '$sum': 1 } } },
      { '$sort': { 'tweetCount': -1 } },
      { '$limit': 1 }
    ];
    const result = await collection.aggregate(agg).toArray();
    console.log(result);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

findUserMostTweets();
