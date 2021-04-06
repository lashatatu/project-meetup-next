import { MongoClient } from 'mongodb';

async function connectDatabase () {
	const client = await MongoClient.connect(
		 'mongodb+srv://lashatatu:zr1wZbHY6XEc38JY@lashamax.b0l9y.mongodb.net/events?retryWrites=true&w=majority'
	);

	return client;
}

async function insertDocument (client, document) {
	const db = client.db();

	await db.collection('newsletter').insertOne({document});
}

async function handler (req, res) {
	if ( req.method === 'POST' ) {
		const userEmail = req.body.email;

		if ( !userEmail || !userEmail.includes('@') ) {
			res.status(422).json({message: 'invalid email address'});
			return;
		}

		let client;

		try {
			const client = await connectDatabase();
		} catch ( error ) {
			res.status(500).json({message:'failed to connect database'})
			return
		}

		try {
			await insertDocument(client, {email: userEmail});
			client.close();
		} catch ( error ) {
			res.status(500).json({message:'inserting data failed'})
			return
		}

		res.status(201).json({message: 'email sent'});
	}
}

export default handler;