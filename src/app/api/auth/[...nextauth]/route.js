import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectToDB();

          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: true,
              password: "",
              role: "user",
            });
          }

          return true;
        } catch (error) {
          console.error("خطا در signIn:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          await connectToDB();
          const user = await User.findOne({ email: session.user.email });

          if (user) {
            session.user.id = user._id.toString();
            session.user.role = user.role;
          }
        } catch (error) {
          console.error("خطا در session:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login-register",
    error: "/login-register",
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;