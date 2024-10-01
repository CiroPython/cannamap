import { createContext, useState, useEffect, ReactNode } from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { useRouter } from "next/router";

interface AuthContextProps {
  isLoggedIn: boolean;
  loginJWF: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  loginJWF: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { token } = parseCookies(); // Recupera i cookie dal client
    setIsLoggedIn(!!token); // Aggiorna lo stato in base alla presenza del token
  }, []);

  const loginJWF = (token: string) => {
    setCookie(null, "token", token, {
      maxAge: 30 * 24 * 60 * 60, // 30 giorni
      path: "/",
    });
    setIsLoggedIn(true); // Aggiorna lo stato
  };

  const logout = () => {
    destroyCookie(null, "token");
    setIsLoggedIn(false); // Aggiorna lo stato per il logout
    router.push("/login"); // Redirige alla pagina di login
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginJWF, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
