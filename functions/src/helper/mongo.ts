import * as functions from 'firebase-functions';
import { MongoClient } from 'mongodb';

let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const uri = functions.config().mongodb.uri;
  const client = new MongoClient(uri);

  await client.connect();
  cachedDb = client.db('ugoku');
  return cachedDb;
}

exports.mongodbFunction = functions.https.onRequest(async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('your-collection-name');

    // Example operation: Retrieve all documents
    const documents = await collection.find({}).toArray();

    res.status(200).send(documents);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).send('Error connecting to MongoDB');
  }
});
