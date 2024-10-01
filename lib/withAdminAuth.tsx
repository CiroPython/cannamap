import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import dbConnect from "./mongodb";
export const withAdminAuth = (getServerSidePropsFunc: any) => {
    return async (context: any) => {
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
  
        // Se l'utente è autenticato come admin, esegui la funzione passata
        const result = await getServerSidePropsFunc(context);
  
        // Assicurati che `props` sia definito e che i dati siano sotto `props`
        return {
          ...result,
          props: {
            ...result.props,
          },
        };
      } catch (error) {
        return {
          redirect: {
            destination: "/login",
            permanent: false,
          },
        };
      }
    };
  };
  