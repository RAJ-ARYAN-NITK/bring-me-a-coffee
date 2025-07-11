// import React from 'react'
// import PaymentPage from '@/components/PaymentPage'
// import { notFound } from "next/navigation"
// import connectDb from '@/db/connectDB'
// import User from '@/models/User'

// const Username = async ({ params }) => {
//   await connectDb()
//   const checkUser = async () => {
  
//     let u = await User.findOne({ username: params.username })
//     if (!u) {
//       return notFound()
//     }
//   }
//   await checkUser()



//   return (
//     <>
//       <PaymentPage username={params.username} />
//     </>
//   )
// }

// export default Username
 
// export async function generateMetadata({ params }) {
//   return {
//     title: `Support ${params.username} - Get Me A Chai`,
//   }
// }



// import React from 'react';
// import PaymentPage from '@/components/PaymentPage';
// import { notFound } from 'next/navigation';
// import connectDb from '@/db/connectDB';
// import User from '@/models/User';

// const Username = async ({ params }) => {
//   await connectDb();

//   const user = await User.findOne({ username: params.username }).lean();

//   if (!user) {
//     notFound();
//   }

//   return <PaymentPage username={params.username} />;
// };

// export default Username;

// export async function generateMetadata({ params }) {
//   return {
//     title: `Support ${params.username} - Bring Me A Coffee`,
//   };
// }


// import React from 'react';
// import PaymentPage from '@/components/PaymentPage';
// import { notFound } from 'next/navigation';
// import connectDb from '@/db/connectDB';
// import User from '@/models/User';
// import { toPlainObject } from '@/utils/toPlainObject';

// const Username = async ({ params }) => {
//   await connectDb();

//   const userDoc = await User.findOne({ username: params.username });

//   if (!userDoc) {
//     notFound();
//   }

//   const user = toPlainObject(userDoc); // Safe conversion

//   return <PaymentPage username={params.username} />;

// };

// export default Username;

// export async function generateMetadata({ params }) {
//   return {
//     title: `Support ${params.username} - Bring Me A Coffee`,
//   };
// }

import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from "next/navigation"
import connectDb from '@/db/connectDB'
import User from '@/models/User'
import { toPlainObject } from '@/utils/toPlainObject' // <-- Import here

const Username = async ({ params }) => {
  const awaitedParams = await params; // Ensure params is awaited if it's a promise
  await connectDb()
  const user = await User.findOne({ username: awaitedParams.username }).lean();

  if (!user) {
    notFound()
  }

  // Convert the user document to a plain JS object
  const plainUser = toPlainObject(user)
  console.dir(plainUser, { depth: null });
  // const safeUser = JSON.parse(JSON.stringify(plainUser));

  return (
  <>
      {/* Pass plainUser to your client component if you need more than the username */}
      <PaymentPage username={awaitedParams.username} user={plainUser} />
  </>
  )
}

export default Username

export async function generateMetadata({ params }) {
  const awaitedParams = await params; // Ensure params is awaited if it's a promise
  return {
    title: `Support ${awaitedParams.username} - Bring Me A Coffee`,
  }
}
