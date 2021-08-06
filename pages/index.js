import Head from 'next/head'
// connectToDatabase only works on the server side
import { connectToDatabase } from '../lib/mongodb'
import { useState } from 'react';

export default function Home({ properties }) {

  const [bnbs, setBnbs] = useState(properties);

  const book = async (property) => {
    const res = await fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: property._id,
        guest: "Josh"
      })
    });
    const data = await res.json();
    console.log(data);
  }

  const [term, setTerm] = useState('');
  const search = async (e) => {
    e.preventDefault();
    if ( term ) {
      const res = await fetch(`http://localhost:3000/api/search?term=${term}`);
      const data = await res.json();
      setBnbs(data);
    } else {
      const res = await fetch('http://localhost:3000/api/getBnbData');
      const data = await res.json();
      setBnbs(data);
    }
  }
  

  return (
    <div>
      <Head>
        <title>Next BNB</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/tailwindcss@1.0/dist/tailwind.min.css" />
      </Head>

      <div className="container mx-auto">

        <div className="flex">
          <div className="raw w-full text-center my-4">
            <h1 className="text-4xl font-extrabold mb-5">
              Next BNB
              <span className="text-sm text-gray-400 font-semibold">
                ( Next.js with MongoDB )
              </span>
            </h1>
          </div>
          <div className="raw w-full text-center my-4">
            <form 
              className="bg-white flex items-center rounded shadow-xl w-2/4" 
              onSubmit={(e) => search(e)}
            >
              <input 
                className="rounded w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none" 
                type="text" 
                name="term" 
                placeholder="Search"
                value={term} 
                onChange={(e) => setTerm(e.target.value)} 
              />
              <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-row flex-wrap">
          {
            bnbs && bnbs.map(property => (

                <div className="flex-auto w-1/4 rounded overflow-hidden shadow-lg m-2" key={property._id}>
                  <img className="w-full" src={property.image} alt="" />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">(up to {property.name} guests)</div>
                    <p>{property.address.street}</p>
                    <p className="text-grey-700 text-base">{property.summary}</p>
                  </div>

                  <div className="text-center py-2 my-2 font-bold">
                    <span className="text-green-500">${property.price}</span> / night
                  </div>

                  <div className="text-center py-2 my-2">
                    <button 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-5 rounded" 
                      onClick={() => book(property)}
                    >
                      Book
                    </button>
                  </div>
                </div>
            ))
          }
        </div>

      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const data = await db.collection("listingsAndReviews").find({}).limit(20).toArray();

  // parse the data to use on nextjs its not able to deal with pure mongodb data.
  const properties = JSON.parse(JSON.stringify(data));

  // restructure the data 
  const filtered = properties.map(property => {
    const price = JSON.parse(JSON.stringify(property.price));
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
  return {
    props: { properties: filtered },
  }
}


  // const book = async (property) => {
    //   const res = await fetch(`http://localhost:3000/api/book?property_id=${property._id}&guest=Yoshi`);
    //   const data = await res.json();
    //   console.log(data);
    // }