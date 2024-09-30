import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../components/theme";
import Header from "../components/Header"; // Assicurati di importare il tuo header
import { AuthProvider } from "../contexts/AuthContext"; // Importa l'AuthProvider

import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        {/* Aggiungi l'header qui per tutte le pagine */}
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
