"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import User from "@/models/User";
import connectDB from "@/db/connectDB";


export const initiate = async (amount, to_username, paymentform) => {
    await connectDB()
    // fetch the secret of the user who is getting the payment 
    let user = await User.findOne({username: to_username})


    if (!user) {
        throw new Error("User not found");
    }
    console.log("KEY_ID:", user.KEY_ID);
    console.log("KEY_SECRET:", user.KEY_SECRET);


    var instance = new Razorpay({ key_id: user.KEY_ID, key_secret: user.KEY_SECRET});



    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }

    let x = await instance.orders.create(options)

    // create a payment object which shows a pending payment in the database
    await Payment.create({ oid: x.id, amount: amount/100, to_user: to_username, name: paymentform.name, message: paymentform.message })

    return x

}


export const fetchuser = async (username) => {
    await connectDB()
    let u = await User.findOne({ username: username })
    let user = u.toObject({ flattenObjectIds: true })
    return user
}

export const fetchpayments = async (username) => {
    await connectDB()
    // find all payments sorted by decreasing order of amount and flatten object ids
    let p = await Payment.find({ to_user: username, done:true }).sort({ amount: -1 }).limit(10).lean()
    return p
}

export const updateProfile = async (data, oldusername) => {
    await connectDB()
    let ndata = Object.fromEntries(Object.entries(data).filter(([_, v]) => v));

    // If the username is being updated, check if username is available
    if (oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username })
        if (u) {
            return { error: "Username already exists" };
        }   
        await User.updateOne({email: ndata.email}, ndata)
        // Now update all the usernames in the Payments table 
        await Payment.updateMany({to_user: oldusername}, {to_user: ndata.username})
        
    }
    else{
        await User.updateOne({email: ndata.email}, ndata)
    }
    return { success: true, message: "Profile updated successfully" };
};

