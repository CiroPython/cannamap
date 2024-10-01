import LogoutButton from "@/components/LogoutButton";
import { Container, Typography, Box, Button } from "@mui/material";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

interface Order {
  name: string;
}

interface User {
  firstName: string;
  lastName: string;
  username: string;
  orders: Order[];
}

const Account = ({ user }: { user: User }) => {
  if (!user) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4">Account</Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Nome: {user.firstName}
        </Typography>
        <Typography variant="h6">Cognome: {user.lastName}</Typography>
        <Typography variant="h6">Username: {user.username}</Typography>

        <Typography variant="h5" sx={{ mt: 4 }}>
          Storico Ordini
        </Typography>
        {user.orders.length === 0 ? (
          <Typography>Non hai effettuato nessun ordine.</Typography>
        ) : (
          user.orders.map((order, index) => (
            <Typography key={index}>
              Ordine {index + 1}: {order.name}
            </Typography>
          ))
        )}

        <LogoutButton />
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Verifica del token
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 401) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const data = await res.json();
  return { props: { user: data.user } };
};

export default Account;
