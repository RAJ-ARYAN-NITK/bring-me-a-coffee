
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
// function isBuffer(value) {
//   return value && value.type === 'Buffer' && Array.isArray(value.data);
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
//         }else if (isBuffer(value)) {
//           result[key] = value.toString('base64'); // or 'hex'
//         }else if (typeof value === "object" && value !== null) {
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

// import mongoose from "mongoose";

// function isObjectId(value) {
//   // Handles both Mongoose ObjectId and plain objects with buffer property
//   return (
//     value &&
//     (
//       (typeof value === "object" && value.constructor && value.constructor.name === "ObjectId") ||
//       (mongoose.Types.ObjectId && value instanceof mongoose.Types.ObjectId) ||
//       (typeof value === "object" && value.buffer && Buffer.isBuffer(value.buffer))
//     )
//   );
// }
// function isDate(value) {
//   return value instanceof Date;
// }

// function isBuffer(value) {
//   // Handles both Node.js Buffer and plain objects with type/data
//   return Buffer.isBuffer(value) ||
//     (value && value.type === 'Buffer' && Array.isArray(value.data));
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
//           if (typeof value.toString === "function") {
//             result[key] = value.toString();
//           } else if (value.buffer && Buffer.isBuffer(value.buffer)) {
//             result[key] = value.buffer.toString('hex');
//           }
//         } else if (isDate(value)) {
//           result[key] = value.toISOString();
//         } else if (isBuffer(value)) {
//           result[key] = Buffer.isBuffer(value)
//             ? value.toString('base64')
//             : Buffer.from(value.data).toString('base64');
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

// import mongoose from "mongoose";
// import { Buffer } from "buffer"; // Only needed in some environments

// function isObjectId(value) {
//   return (
//     value &&
//     (
//       (typeof value === "object" && value.constructor && value.constructor.name === "ObjectId") ||
//       (typeof value === "object" && value.buffer && Buffer.isBuffer(value.buffer))
//     )
//   );
// }

// function isDate(value) {
//   return value instanceof Date;
// }

// function isBuffer(value) {
//   return Buffer.isBuffer(value) ||
//     (value && value.type === 'Buffer' && Array.isArray(value.data));
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
//           if (typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
//             result[key] = value.toString();
//           } else if (value.buffer && Buffer.isBuffer(value.buffer)) {
//             result[key] = value.buffer.toString('hex');
//           }
//         } else if (isDate(value)) {
//           result[key] = value.toISOString();
//         } else if (isBuffer(value)) {
//           result[key] = Buffer.isBuffer(value)
//             ? value.toString('base64')
//             : Buffer.from(value.data).toString('base64');
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
import { Buffer } from "buffer";

function isObjectId(value) {
  return (
    value &&
    (
      (typeof value === "object" && value.constructor && value.constructor.name === "ObjectId") ||
      (typeof value === "object" && value.buffer && Buffer.isBuffer(value.buffer))
    )
  );
}

function isDate(value) {
  return value instanceof Date;
}

function isBuffer(value) {
  return Buffer.isBuffer(value) ||
    (value && value.type === 'Buffer' && Array.isArray(value.data));
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
          if (typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
            result[key] = value.toString();
          } else if (value.buffer && Buffer.isBuffer(value.buffer)) {
            result[key] = value.buffer.toString('hex');
          }
        } else if (isDate(value)) {
          result[key] = value.toISOString();
        } else if (isBuffer(value)) {
          result[key] = Buffer.isBuffer(value)
            ? value.toString('base64')
            : Buffer.from(value.data).toString('base64');
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
