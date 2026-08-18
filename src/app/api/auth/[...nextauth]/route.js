import { handlers } from "@/lib/auth";

// Config lives in src/lib/auth.js so it can be imported outside this route.
export const GET = handlers.GET;
export const POST = handlers.POST;