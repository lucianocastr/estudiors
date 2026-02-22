import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./db";

// Tipos extendidos para la sesión
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      rol: "ADMIN" | "PROFESIONAL";
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // Verificar si el usuario existe en nuestra tabla de usuarios
      const existingUser = await prisma.usuario.findUnique({
        where: { email: user.email },
      });

      // Solo permitir login si el usuario está registrado y activo
      if (!existingUser || !existingUser.activo) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const usuario = await prisma.usuario.findUnique({
          where: { email: user.email },
        });
        if (usuario) {
          token.id = usuario.id;
          token.rol = usuario.rol;
          token.nombre = usuario.nombre;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as "ADMIN" | "PROFESIONAL";
        session.user.name = token.nombre as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirigir al panel después del login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/panel`;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});

// Helper para verificar si el usuario es admin
export async function isAdmin(email: string): Promise<boolean> {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });
  return usuario?.rol === "ADMIN";
}

// Helper para obtener el usuario actual del panel
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return prisma.usuario.findUnique({
    where: { email: session.user.email },
  });
}
