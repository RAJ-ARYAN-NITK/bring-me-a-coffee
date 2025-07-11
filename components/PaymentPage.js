"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import Razorpay from "razorpay";


const PaymentPage = ({ username }) => {
  const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
  const [currentUser, setcurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const getData = useCallback(async () => {
    let u = await fetchuser(username);
    setcurrentUser(u);
    let dbpayments = await fetchpayments(username);
    setPayments(dbpayments);
  }, [username]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast("Thanks for your donation!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
  
      // Delay navigation to allow toast to show
      setTimeout(() => {
        router.push(`/${username}`);
      }, 5500);
    }
  }, [searchParams]);
  

  const handleChange = (e) => {
    setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };


  const pay = async (amountInPaise) => {
    try {
      const order = await initiate(amountInPaise, username, paymentform);
      const orderId = order.id;
  
      const options = {
        key: currentUser.KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "Bring me a Coffee",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: orderId,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
        prefill: {
          name: paymentform.name,
          email: currentUser.email,
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        toast.error("Razorpay SDK not loaded. Please try again later.");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      toast.error("Payment failed. Please try again.");
    }
  };
  
 
  

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="cover bg-red-50 relative">
        <Image
          className="object-cover"
          src={currentUser.coverpic ||  "/patreon_banner.gif"}
          alt="Coffee Cup"
          width={1440}
          height={20}
          onError={(e) => (e.target.src = "/patreon_banner.gif")}
          unoptimized
        />
        <div className="absolute -bottom-15 right-[47%] border border-yellow-500 rounded-full">
          <Image
            className="rounded-full"
            width={80}
            height={80}
            src={currentUser.profilepic || "/Aryan.jpg"}
            alt=""
          />
        </div>
      </div>

      <div className="info flex justify-center items-center my-16 flex-col gap-2">
        <div className="font-bold text-lg">@{username}</div>
        <div className="text-slate-400">Let's help {username} get a Coffee! </div>
        <div className="text-slate-400">
          {payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
        </div>

        <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
          <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
            <h2 className="text-2xl font-bold my-5">Top 10 Supporters</h2>
            <ul className="mx-5 text-lg">
              {payments.length === 0 && <li>No payments yet</li>}
              {payments.map((p, i) => (
                <li key={i} className="my-4 flex gap-2 items-center">
                  <Image
                    style={{ borderRadius: "50%" }}
                    src="/Avatar.gif"
                    width={33}
                    height={33}
                    alt="user avatar"
                    unoptimized
                  />
                  <span>
                    {p.name} donated <span className="font-bold">₹{p.amount}</span> with a message &quot;{p.message}&quot;
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
            <h2 className="text-2xl font-bold my-5">Make a Payment</h2>
            <div className="flex gap-2 flex-col">
              <input
                onChange={handleChange}
                value={paymentform.name}
                name="name"
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Name"
              />
              <input
                onChange={handleChange}
                value={paymentform.message}
                name="message"
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Message"
              />
              <input
                onChange={handleChange}
                value={paymentform.amount}
                name="amount"
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Amount"
              />
              <button
                onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                type="button"
                className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4 ||
                  paymentform.amount?.length < 1
                }
              >
                Pay
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-5">
              <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(1000)}>
                Pay ₹10
              </button>
              <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(2000)}>
                Pay ₹20
              </button>
              <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(3000)}>
                Pay ₹30
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;

// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Script from "next/script";
// import { useSession } from "next-auth/react";
// import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
// import { useSearchParams, useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Bounce } from "react-toastify";

// const PaymentPage = ({ username }) => {
//   const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
//   const [currentUser, setcurrentUser] = useState(null); // ✅ default to null
//   const [payments, setPayments] = useState([]);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     if (searchParams.get("paymentdone") === "true") {
//       toast("Thanks for your donation!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });

//       setTimeout(() => {
//         router.push(`/${username}`);
//       }, 5500);
//     }
//   }, [searchParams]);

//   const handleChange = (e) => {
//     setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
//   };

//   const getData = async () => {
//     try {
//       const u = await fetchuser(username);
//       const dbpayments = await fetchpayments(username);
//       setcurrentUser(u); // ✅ updated after successful fetch
//       setPayments(dbpayments);
//     } catch (error) {
//       toast.error("Failed to fetch user data");
//       console.error("Fetch error:", error);
//     }
//   };

//   const pay = async (amountInPaise) => {
//     try {
//       const order = await initiate(amountInPaise, username, paymentform);
//       const orderId = order.id;

//       const options = {
//         key: currentUser.KEY_ID,
//         amount: amountInPaise,
//         currency: "INR",
//         name: "Bring me a Coffee",
//         description: "Test Transaction",
//         image: "https://example.com/your_logo",
//         order_id: orderId,
//         callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
//         prefill: {
//           name: paymentform.name,
//           email: currentUser.email,
//           contact: "9000090000",
//         },
//         notes: {
//           address: "Razorpay Corporate Office",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       if (typeof window !== "undefined" && window.Razorpay) {
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         toast.error("Razorpay SDK not loaded. Please try again later.");
//       }
//     } catch (err) {
//       console.error("Payment initiation failed:", err);
//       toast.error("Payment failed. Please try again.");
//     }
//   };

//   // ✅ Render nothing or loader until currentUser is fetched
//   if (!currentUser) {
//     return (
//       <>
//         <ToastContainer />
//         <div className="text-center py-20 font-semibold text-lg text-slate-500">
//           Loading user profile...
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
//       <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

//       <div className="cover bg-red-50 relative">
//         <Image
//           className="object-cover"
//           src={currentUser.coverpic || "/patreon_banner.gif"} // ✅ safely accessed after null check
//           alt="Coffee Cup"
//           width={1440}
//           height={200}
//           unoptimized
//         />
//         <div className="absolute -bottom-15 right-[47%] border border-yellow-500 rounded-full">
//           <Image
//             className="rounded-full"
//             width={80}
//             height={80}
//             src={currentUser.profilepic || "/Aryan.jpg"}
//             alt="Profile Pic"
//           />
//         </div>
//       </div>

//       <div className="info flex justify-center items-center my-16 flex-col gap-2">
//         <div className="font-bold text-lg">@{username}</div>
//         <div className="text-slate-400">Let's help {username} get a Coffee!</div>
//         <div className="text-slate-400">
//           {payments.length} Payments · ₹
//           {payments.reduce((a, b) => a + b.amount, 0)} raised
//         </div>

//         <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
//           <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
//             <h2 className="text-2xl font-bold my-5">Top 10 Supporters</h2>
//             <ul className="mx-5 text-lg">
//               {payments.length === 0 && <li>No payments yet</li>}
//               {payments.map((p, i) => (
//                 <li key={i} className="my-4 flex gap-2 items-center">
//                   <Image
//                     style={{ borderRadius: "50%" }}
//                     src="/Avatar.gif"
//                     width={33}
//                     height={33}
//                     alt="user avatar"
//                   />
//                   <span>
//                     {p.name} donated <span className="font-bold">₹{p.amount}</span> with a
//                     message &quot;{p.message}&quot;
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
//             <h2 className="text-2xl font-bold my-5">Make a Payment</h2>
//             <div className="flex gap-2 flex-col">
//               <input
//                 onChange={handleChange}
//                 value={paymentform.name}
//                 name="name"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Name"
//               />
//               <input
//                 onChange={handleChange}
//                 value={paymentform.message}
//                 name="message"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Message"
//               />
//               <input
//                 onChange={handleChange}
//                 value={paymentform.amount}
//                 name="amount"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Amount"
//               />
//               <button
//                 onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
//                 type="button"
//                 className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
//                 disabled={
//                   paymentform.name?.length < 3 ||
//                   paymentform.message?.length < 4 ||
//                   paymentform.amount?.length < 1
//                 }
//               >
//                 Pay
//               </button>
//             </div>
//             <div className="flex flex-col md:flex-row gap-2 mt-5">
//               <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(1000)}>
//                 Pay ₹10
//               </button>
//               <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(2000)}>
//                 Pay ₹20
//               </button>
//               <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(3000)}>
//                 Pay ₹30
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentPage;


// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Script from "next/script";
// import { useSearchParams, useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Bounce } from "react-toastify";
// import { fetchpayments, initiate } from "@/actions/useractions";

// const PaymentPage = ({ user }) => {
//   const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
//   const [payments, setPayments] = useState([]);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     if (searchParams.get("paymentdone") === "true") {
//       toast("Thanks for your donation!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });

//       setTimeout(() => {
//         router.push(`/${user.username}`);
//       }, 5500);
//     }
//   }, [searchParams]);

//   const handleChange = (e) => {
//     setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
//   };

//   const getData = async () => {
//     try {
//       const dbpayments = await fetchpayments(user.username);
//       setPayments(dbpayments);
//     } catch (error) {
//       toast.error("Failed to fetch payment data");
//       console.error("Fetch error:", error);
//     }
//   };

//   const pay = async (amountInPaise) => {
//     try {
//       const order = await initiate(amountInPaise, user.username, paymentform);
//       const orderId = order.id;

//       const options = {
//         key: user.KEY_ID,
//         amount: amountInPaise,
//         currency: "INR",
//         name: "Bring me a Coffee",
//         description: "Test Transaction",
//         image: "https://example.com/your_logo",
//         order_id: orderId,
//         callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
//         prefill: {
//           name: paymentform.name,
//           email: user.email,
//           contact: "9000090000",
//         },
//         notes: {
//           address: "Razorpay Corporate Office",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       if (typeof window !== "undefined" && window.Razorpay) {
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         toast.error("Razorpay SDK not loaded. Please try again later.");
//       }
//     } catch (err) {
//       console.error("Payment initiation failed:", err);
//       toast.error("Payment failed. Please try again.");
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

//       <div className="cover bg-red-50 relative">
//         <Image
//           className="object-cover"
//           src={user.coverpic || "/patreon_banner.gif"}
//           alt="Coffee Cup"
//           width={1440}
//           height={200}
//           unoptimized
//         />
//         <div className="absolute -bottom-15 right-[47%] border border-yellow-500 rounded-full">
//           <Image
//             className="rounded-full"
//             width={80}
//             height={80}
//             src={user.profilepic || "/Aryan.jpg"}
//             alt="Profile Pic"
//           />
//         </div>
//       </div>

//       <div className="info flex justify-center items-center my-16 flex-col gap-2">
//         <div className="font-bold text-lg">@{user.username}</div>
//         <div className="text-slate-400">Let's help {user.username} get a Coffee!</div>
//         <div className="text-slate-400">
//           {payments.length} Payments · ₹
//           {payments.reduce((a, b) => a + b.amount, 0)} raised
//         </div>

//         <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
//           <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
//             <h2 className="text-2xl font-bold my-5">Top 10 Supporters</h2>
//             <ul className="mx-5 text-lg">
//               {payments.length === 0 && <li>No payments yet</li>}
//               {payments.map((p, i) => (
//                 <li key={i} className="my-4 flex gap-2 items-center">
//                   <Image
//                     style={{ borderRadius: "50%" }}
//                     src="/Avatar.gif"
//                     width={33}
//                     height={33}
//                     alt="user avatar "
//                     unoptimized
//                   />
//                   <span>
//                     {p.name} donated <span className="font-bold">₹{p.amount}</span> with a
//                     message &quot;{p.message}&quot;
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
//             <h2 className="text-2xl font-bold my-5">Make a Payment</h2>
//             <div className="flex gap-2 flex-col">
//               <input
//                 onChange={handleChange}
//                 value={paymentform.name}
//                 name="name"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Name"
//               />
//               <input
//                 onChange={handleChange}
//                 value={paymentform.message}
//                 name="message"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Message"
//               />
//               <input
//                 onChange={handleChange}
//                 value={paymentform.amount}
//                 name="amount"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Amount"
//               />
//               <button
//                 onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
//                 type="button"
//                 className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
//                 disabled={
//                   paymentform.name?.length < 3 ||
//                   paymentform.message?.length < 4 ||
//                   paymentform.amount?.length < 1
//                 }
//               >
//                 Pay
//               </button>
//             </div>
//             <div className="flex flex-col md:flex-row gap-2 mt-5">
//               <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(1000)}>
//                 Pay ₹10
//               </button>
//               <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(2000)}>
//                 Pay ₹20
//               </button>
//               <button className="bg-slate-800 p-3 rounded-lg" onClick={() => pay(3000)}>
//                 Pay ₹30
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentPage;
