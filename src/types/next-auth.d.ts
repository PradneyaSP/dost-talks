import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

// Extend the JWT type to include a new 'id' property
declare module 'next-auth/jwt'{
    interface JWT {
        id: string;
    }
}

// Extend the Session type to include a new 'id' property in the 'user' object
declare module 'next-auth' {
    interface Session {
        user: User & {
            id: UserId;
        };
    }
}
