const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connetti il client al server
    await client.connect();
    // Conferma una connessione riuscita
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
    process.exit(1); // Termina l'applicazione se la connessione al database fallisce
  }
}

module.exports = { connectToDatabase, client };
