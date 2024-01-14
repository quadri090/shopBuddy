import { mergeAnonymousCartIntoUserCart } from "@/lib/db/carts"
import { prisma } from "@/lib/db/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import { env } from "@/lib/env";
import GoogleProvider from "next-auth/providers/google"

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
      providers: [
          GoogleProvider({
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET
          })
      ],
      callbacks: {
          session({session, user}) {
              session.user.id = user.id
              return session
          }
      },
      events: {
          async signIn({user}) {
              await mergeAnonymousCartIntoUserCart(user.id)
          }
      }
  }

  export default authOptions
