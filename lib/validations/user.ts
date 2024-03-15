import { z } from "zod";

export const UserValidation = z.object({
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  bio: z.string().min(3).max(1000),
  profile_photo: z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
  }),
});
