import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<void> {
  if (cached.conn) {
    console.log("Already connected to DB");
    return;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "anonova",
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ DB connected successfully");
}

export default dbConnect;







// import mongoose from "mongoose";

// type connectionObject = {
//     isConnected? : number
// }

// const connection : connectionObject = {}


// async function dbConnect():Promise<void> {
//     if (connection.isConnected) {
//         console.log("Already connected to the DB");
//         return
//     }

//     try {
//       const db = await mongoose.connect(process.env.MONGODB_URI || "")
      
//       connection.isConnected = db.connections[0].readyState

//     //   console.log(db);
      
//     //   console.log(db.connections[0]);
//     //   console.log(db.connection);
      
//       console.log("Db connected succefully");
      
      
//     } catch (error) {
//         console.log("Db Connection Failed",error);

//         process.exit(1)
        
//     }
// }

// export default dbConnect