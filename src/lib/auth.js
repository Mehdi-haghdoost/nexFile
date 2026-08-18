import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

/**
 * NextAuth handles the Google handshake only. The app's own session lives in
 * the token/refreshToken cookies, which /api/auth/oauth-session issues once
 * this provider has verified the identity.
 *
 * Config lives here rather than in the route file so server code can import
 * auth() without pulling in the route handler.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    // Required behind a proxy or when the host header differs from AUTH_URL
    trustHost: true,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "google") return true;

            try {
                await connectToDB();

                // Google only returns an email once it has verified it, so matching on
                // email is safe here and links an existing account rather than
                // creating a duplicate.
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        emailVerified: true,
                        password: "",
                        role: "user",
                    });
                    return true;
                }

                // Keep the avatar fresh without touching anything the user owns
                if (user.image && existingUser.image !== user.image) {
                    existingUser.image = user.image;
                    await existingUser.save();
                }

                return true;
            } catch (error) {
                console.error("Google signIn error:", error);
                return false;
            }
        },
        async session({ session }) {
            if (!session?.user?.email) return session;

            try {
                await connectToDB();
                const user = await User.findOne({ email: session.user.email });

                if (user) {
                    session.user.id = user._id.toString();
                    session.user.role = user.role;
                }
            } catch (error) {
                console.error("Session callback error:", error);
            }

            return session;
        },
    },
    pages: {
        signIn: "/login-register",
        error: "/login-register",
    },
});