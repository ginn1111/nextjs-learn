import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getUser } from './app/lib/data';
import bcrypt from 'bcrypt';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    credentials({
      authorize: async ({ email, password }) => {
        const validateFields = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse({ email, password });

        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const user = await getUser(email);
          if (!user) return null;
          const equalPwd = await bcrypt.compare(password, user.password);

          if (equalPwd) return user;
        }

        return null;
      },
    }),
  ],
});
