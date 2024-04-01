import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet'; 

async function separateUsersReferenceTweets() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected correctly');
    const db = client.db(dbName);

    const usersPipeline = [
      {
        '$group': {
          '_id': '$user.id',
          'userDoc': { '$first': '$user' }
        }
      },
      {
        '$replaceRoot': { 'newRoot': '$userDoc' }
      },
      {
        '$merge': {
          'into': 'Users', 
          'on': '_id',
          'whenMatched': 'replace',
          'whenNotMatched': 'insert'
        }
      }
    ];

    await db.collection('tweets').aggregate(usersPipeline).toArray();
    console.log('Users collection created or updated.');

    const tweetsPipeline = [
      {
        '$project': {
          'created_at': 1,
          'text': 1,
          'entities': 1,
          'user_id': '$_id', 
          'user': 0 
        }
      },
      {
        '$merge': {
          'into': 'Tweets_Only', 
          'on': '_id',
          'whenMatched': 'replace',
          'whenNotMatched': 'insert'
        }
      }
    ];


    await db.collection('tweets').aggregate(tweetsPipeline).toArray();
    console.log('Tweets_Only collection created or updated.');

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

separateUsersReferenceTweets();
