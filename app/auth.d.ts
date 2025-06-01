declare module '#auth-utils' {
  interface User {
    email: string;
    user_lastname: string;
    user_name: string;
    avatar_url?: string;
    userId: string;
    loggedInAt: string;
  }
}

export {};
