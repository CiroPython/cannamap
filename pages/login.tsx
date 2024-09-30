import { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/account");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Errore di connessione con il server");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Non hai un account?{" "}
          <Link href="/register" color="primary">
            Creane uno
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

// Verifica se l'utente è già loggato e redirigi alla pagina account se necessario
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };
  }

  return { props: {} }; // Se non c'è il token, carica normalmente la pagina di login
};

export default Login;
