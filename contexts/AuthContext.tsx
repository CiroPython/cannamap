import { createContext, useState, useEffect, ReactNode } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  loginJWF: (token: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loginJWF: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = cookie.get("token");
    setIsLoggedIn(!!token); // Aggiorna lo stato basandoti sulla presenza del token
  }, []);

  const loginJWF = (token: string) => {
    cookie.set("token", token); // Imposta il token come cookie
    setIsLoggedIn(true); // Aggiorna lo stato
  };

  const logout = () => {
    cookie.remove("token");
    setIsLoggedIn(false); // Aggiorna lo stato di logout
    router.push("/login"); // Redirige alla pagina di login
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, loginJWF, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
