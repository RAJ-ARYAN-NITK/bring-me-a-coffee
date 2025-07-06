
// export function convertUser(userDoc) {
//   return {
//     ...userDoc.toObject(), // Converts Mongoose document to plain JS object
//     _id: userDoc._id.toString(),
//     createdAt: userDoc.createdAt.toISOString(),
//     updatedAt: userDoc.updatedAt.toISOString(),
//   };
// }

// export function convertUser(userDoc) {
//   if (!userDoc) return null;
//   return {
//     ...userDoc,
//     _id: userDoc._id?.toString?.() || userDoc._id,
//     createdAt: userDoc.createdAt?.toISOString?.() || userDoc.createdAt,
//     updatedAt: userDoc.updatedAt?.toISOString?.() || userDoc.updatedAt,
//   };
// }


// import mongoose from "mongoose";

// function isObjectId(value) {
//   return (
//     value &&
//     typeof value === "object" &&
//     (value.constructor.name === "ObjectId" ||
//       (mongoose.Types.ObjectId && value instanceof mongoose.Types.ObjectId))
//   );
// }

// function isDate(value) {
//   return value instanceof Date;
// }

// export function toPlainObject(obj) {
//   if (Array.isArray(obj)) {
//     return obj.map(toPlainObject);
//   }
//   if (obj && typeof obj === "object") {
//     const result = {};
//     for (const key in obj) {
//       if (Object.prototype.hasOwnProperty.call(obj, key)) {
//         const value = obj[key];
//         if (isObjectId(value)) {
//           result[key] = value.toString();
//         } else if (isDate(value)) {
//           result[key] = value.toISOString();
//         } else if (typeof value === "object" && value !== null) {
//           result[key] = toPlainObject(value);
//         } else {
//           result[key] = value;
//         }
//       }
//     }
//     return result;
//   }
//   return obj;
// }

import mongoose from "mongoose";

function isObjectId(value) {
  return (
    value &&
    typeof value === "object" &&
    (value.constructor.name === "ObjectId" ||
      (mongoose.Types.ObjectId && value instanceof mongoose.Types.ObjectId))
  );
}

function isDate(value) {
  return value instanceof Date;
}

export function toPlainObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toPlainObject);
  }
  if (obj && typeof obj === "object") {
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (isObjectId(value)) {
          result[key] = value.toString();
        } else if (isDate(value)) {
          result[key] = value.toISOString();
        } else if (typeof value === "object" && value !== null) {
          result[key] = toPlainObject(value);
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  }
  return obj;
}
