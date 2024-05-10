export type UserType = {
  _id: string;
  name: string;
  bio: string;
  email: string;
  password: string | undefined;
  phone: string;
  photo: string;
  profile: "public" | "private";
  role: "admin" | "user";
};
