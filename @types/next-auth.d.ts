import { DefaultSession } from "next-auth";

declare module "next-auth" {//declaring the library where we awant to make changes
    interface Session {
        user: { //user object already exists in next-auth library
            id: string, //adding id field to the user object
        } & DefaultSession["user"] //adding the existing values in next-auth session user object library back to the newly created user object
    }
}

//@typse file is used for changing typscript configuration for next modules
//.d.ts are typescript declaration files which enables us to make changes to existing types so typscript don throw errors