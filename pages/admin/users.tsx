import { GetServerSideProps } from "next";
import AdminLayout from "../../components/AdminLayout";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { isAuthenticated } from "@/lib/authMiddleware"; // Middleware per autenticazione
import User from "@/lib/models/User";
import dbConnect from "../../lib/mongodb";

const UsersPage = ({ users }: { users: any[] }) => {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Gestione Utenti
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ruolo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  // Verifica dell'autenticazione lato server usando il middleware isAuthenticated
  const authResult = await isAuthenticated(async () => {})(req, res);
  if (res.statusCode === 401) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Connessione al database e recupero degli utenti
  await dbConnect();
  const users = await User.find().lean();

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)), // Serializziamo i dati per il passaggio lato client
    },
  };
};

export default UsersPage;
