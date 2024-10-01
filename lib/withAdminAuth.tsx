import {
  GetServerSidePropsContext,
  GetServerSideProps,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";

export const withAdminAuth = <
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  getServerSidePropsFunc: GetServerSideProps<P>
) => {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const { req } = context;
    const cookies = parseCookies({ req });
    const token = cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

      const user = await User.findById(decoded.userId);

      if (!user || user.role !== "admin") {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }

      // Esegui la funzione passata se l'utente è autenticato come admin
      const result = await getServerSidePropsFunc(context);

      // Verifica se il risultato contiene `props`
      if ("props" in result) {
        return {
          ...result,
          props: {
            ...result.props,
          },
        };
      }

      // Restituisci il risultato direttamente in caso non contenga `props`
      return result;
    } catch {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
};
