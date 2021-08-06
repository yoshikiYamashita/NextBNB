import { connectToDatabase } from "../../lib/mongodb";


export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const data = await db.collection("listingsAndReviews").aggregate(
    [
      {
        $search: {
          search: {
            query: req.query.term,
            path: ["description", "amenities"]
          }
        }
      }, 
      // filter your data
      // {
      //   $project: {
      //     description: 1,
      //     amenities: 1
      //   }
      // },
      {
        $limit: 20
      }
    ]
  ).toArray();


  const properties = JSON.parse(JSON.stringify(data));
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
  })

  res.json(filtered);
}

// now you can use serch
// http://localhost:3000/api/search?term=${term}