import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/';
const dbName = 'ieeevisTweets';
const collectionName = 'tweet';

async function countNotRetweetsReplies() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected correctly');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const agg = [
      {
        '$match': {
          'retweeted_status': { '$exists': false },
          'in_reply_to_status_id': null
        }
      }, {
        '$count': 'not_retweets_or_replies'
      }
    ];
    
    const result = await collection.aggregate(agg).toArray();
    console.log('Aggregation result:', result);
    
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

countNotRetweetsReplies();
