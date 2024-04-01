import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function findTopRetweet() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const agg = [
      {
        '$group': {
          '_id': '$user.screen_name',
          'avgRetweets': { '$avg': '$retweet_count' },
          'tweetCount': { '$sum': 1 }
        }
      },
      { '$match': { 'tweetCount': { '$gt': 3 } } },
      { '$sort': { 'avgRetweets': -1 } },
      { '$limit': 10 }
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

findTopRetweet();
