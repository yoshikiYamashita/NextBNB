import { connectToDatabase } from "../../lib/mongodb";


export default async function handler( req, res ) {

  const method = req.method;
  switch ( method ) {

    case 'POST': {

      const { db } = await connectToDatabase();

      const { property_id, guest } = req.body;
      console.log(`Book, property_id: ${property_id}, guest: ${guest}`);

      if ( property_id && guest ) {
        const response = await db.collection("bookings").insertOne({
          property_id: property_id,
          guest: guest
        });
        res.json(response);
      } else {
        res.json({ err: "Pass the props." });
      }
      break
    }

    case 'GET': {
      res.json({ err: "Only POST requests allowed." });
      break;
    }
    default: {
      res.status(403).end();
    }
  }
}


// export default async function handler(req, res) {
//   const { db } = await connectToDatabase();

//   const data = req.query;

//   console.log("recieved data: ", data);

//   const response = await db.collection("bookings").insertOne(data);

//   res.json(response);
// }