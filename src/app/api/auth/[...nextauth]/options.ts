import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/models/User";
import bcrypt from "bcrypt"
import { id } from "zod/v4/locales";
import { email } from "zod/v4";


export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials:{
                email:{label: 'Email' , type: 'text'},
                password:{label: 'Password' , type: 'password'},

            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModal.findOne({
                        $or:[{
                            email: credentials.identifier
                        },
                        {
                            username: credentials.identifier
                        }
                    ]
                    });

                    if (!user) {
                        throw new Error("User not found");
                        
                    }
                    if (!user.isVerified) {
                        throw new Error("plz verified your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    ) 


                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password");
                        
                    }
                    
                } catch (error: any) {
                    
                    throw new Error(error);
                    
                }
            }
        })
    ],
    callbacks:{
async jwt({ token , user }) {
    if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username; // ✅ Add this line
        token.isAcceptingMessages = user.isAcceptingMessages; // ✅ Also add this if needed
    }
    return token;
},

        async session({ session, token,  }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.username = token.username
            }
            return session;
        }
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: '/sign-in'
    }

}