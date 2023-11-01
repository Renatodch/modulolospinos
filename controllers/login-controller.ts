import { Collection, User } from "@/collections/collections";
import DataAccess from "@/data-access/data-access";
import { Responses } from "@/utils/responses";
import { DocumentData, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot, collection } from "firebase/firestore";


import { NextAuthOptions, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default class LoginController{
    private static instance:LoginController;

    private constructor(){}
    public static getInstance():LoginController{
        if(!LoginController.instance){
            LoginController.instance = new LoginController();
        }
        return LoginController.instance;
    }

    authConfig: NextAuthOptions = {
        providers: [
          CredentialsProvider({
            name: "Sign in",
            credentials: {
              id: {
                label: "Email",
                type: "email",
                placeholder: "example@example.com",
              },
              password: { label: "Password", type: "password" },
            },
            authorize: async(credentials)=> {
              if (!credentials || !credentials.id || !credentials.password)
                return null;
      
              const collectionUser = await this.LoginUser(credentials.id,credentials.password);
              //In production DB, passwords should be encrypted using something like bcrypt...
              if (collectionUser) {
                const { password, ...dbUserWithoutPassword } = collectionUser.data;
                return dbUserWithoutPassword as User;
              }
      
              return null;
            },
          }),
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
        ],
    };

    public LoginUser=async (_id:string, pass:string):Promise<Collection<User>|undefined>=>{
        try {
            const docRef = DataAccess.getInstance().GetDocRef(DataAccess.usersCollection,_id)
            let snapshot = await DataAccess.getInstance().GetDocSnapShot(docRef);
            if(snapshot.exists()){
                let user:User = (snapshot.data() as User)
                if(user.password == pass){
                    const collection:Collection<User> = {
                        data: user,
                        _id: _id
                    }
                    return collection;
                }
            }   
        } catch (e) {
            console.log("Error: ",e);
        }
    }
      
    public async loginIsRequiredServer() {
        const session = await getServerSession(this.authConfig);
        if (!session) return redirect("/");
    }

    public loginIsRequiredClient() {
        if (typeof window !== "undefined") {
            const session = useSession();
            const router = useRouter();
            if (!session) router.push("/");
        }
    }
}