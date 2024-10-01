import { createContext, useState, useEffect, ReactNode } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  loginJWF: (token: string) => void;
  logout: () => void; // Aggiungi la funzione logout
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loginJWF: () => {},
  logout: () => {}, // Aggiungi una funzione vuota per logout nel contesto predefinito
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
      value={{ isLoggedIn, setIsLoggedIn, loginJWF, logout }} // Aggiungi logout qui
    >
      {children}
    </AuthContext.Provider>
  );
};
