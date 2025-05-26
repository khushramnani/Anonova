import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document{
    content : string , 
    createdAt: Date,
}

const messageSchema: Schema<Message> = new Schema({

    content:{
        type : String,
        required:true
    },

    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }


},{timestamps:true})



export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptMessaging: boolean
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true , "Username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true , "Email is required"],
        unique: true,
        trim: true,
        match: [new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'), "Plz used Valid Email Address"]
    },
    password:{
        type: String,
        required: [true , "Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true , "VerifyCode is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true , "verifyCodeExpiry is required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptMessaging:{
        type: Boolean,
        default: true,
    },

    messages: [messageSchema]

},{timestamps:true})


const UserModal = (mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>('User',userSchema)


export default UserModal;
