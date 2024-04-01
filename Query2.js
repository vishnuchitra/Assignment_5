import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function findBestScreenNamesByFollowers() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected correctly');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const agg = [
      {
        '$group': {
          '_id': '$user.screen_name',
          'totalFollowers': { '$max': '$user.followers_count' }
        }
      }, {
        '$sort': { 'totalFollowers': -1 }
      }, {
        '$limit': 10
      }
    ];
    
    const result = await collection.aggregate(agg).toArray();
    console.log('Top 10 screen names by followers:', result);
    
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

findBestScreenNamesByFollowers();
