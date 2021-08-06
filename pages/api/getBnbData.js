import { connectToDatabase } from "../../lib/mongodb";


export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const data = await db.collection("listingsAndReviews").find({}).limit(20).toArray();

  // parse data to use on nextjs its not able to deal with pure mongodb data.
  const properties = JSON.parse(JSON.stringify(data));

  // filter
  const filtered = properties.map(property => {
    const price = property.price;
    return {
      _id: property._id,
      name: property.name,
      image: property.images.picture_url,
      address: property.address,
      summary: property.summary,
      guests: property.accommodates,
      price: price.$numberDecimal,
    }
  });
  
  res.json(filtered);
}
