"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import User from "@/models/User";
import connectDB from "@/db/connectDB";
import { toPlainObject } from "@/utils/toPlainObject"; //



export const initiate = async (amount, to_username, paymentform) => {
    await connectDB()
    // fetch the secret of the user who is getting the payment 
    const  user = await User.findOne({username: to_username})


    if (!user) {
        throw new Error("User not found");
    }

    if (!user.KEY_ID || !user.KEY_SECRET) {
        throw new Error("Razorpay credentials are missing for this user.");
    }


    const instance = new Razorpay({ 
        key_id: user.KEY_ID,
        key_secret: user.KEY_SECRET,
    });

    const options = {
        amount: Math.round(parseFloat(amount)), // ₹ → paisa
        currency: "INR",
    };

    const  order = await instance.orders.create(options)

    // create a payment object which shows a pending payment in the database
    await Payment.create({ 
        oid: order.id,
        amount: options.amount/100,
        to_user: to_username, 
        name: paymentform.name, 
        message: paymentform.message 
    });

    return order;
};


export const fetchuser = async (username) => {
    await connectDB();
    const  user = await User.findOne({username }).lean();
    if (!user) return null;
    return toPlainObject(user); // return user earlier
};

export const fetchpayments = async (username) => {
    await connectDB();
    // find all payments sorted by decreasing order of amount and flatten object ids
    const payments = await Payment.find({ to_user: username, done: true })
    .sort({ amount: -1 })
    .limit(10)
    .lean();
    return payments.map(toPlainObject); // return payments earlier
};


export const updateProfile = async (data, oldusername) => {
    await connectDB();

    const  cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== "")
    );

    // If the username is being updated, check if username is available
    if (cleanData.username &&  cleanData.username !== oldusername)  {
        const existingUser = await User.findOne({ username: cleanData.username });
        if (existingUser) {
            return { error: "Username already exists" };
        }   
        await User.updateOne({email: cleanData.email}, cleanData);
        // Now update all the usernames in the Payments table 
        await Payment.updateMany({to_user: oldusername}, {to_user: cleanData.username});
        
    }
    else{
        await User.updateOne({email: cleanData.email}, cleanData);
    }
    return { success: true, message: "Profile updated successfully" };
};

