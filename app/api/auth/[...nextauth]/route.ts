import LoginController from "@/controllers/login-controller";
import NextAuth from "next-auth/next";

const handler = NextAuth(LoginController.getInstance().authConfig);

export { handler as GET, handler as POST };