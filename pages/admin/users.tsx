import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import AdminLayout from "@/components/AdminLayout";
import { withAdminAuth } from "@/lib/withAdminAuth";
import { parseCookies } from "nookies";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken"; // Per verificare il token JWT
import BanUserModal from "@/components/BanUserModal";
import router from "next/router";
import { styled } from "@mui/system";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

// Definizione interfaccia User
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Styled component per la riga rossa chiara
const BannedRow = styled(TableRow)(() => ({
  backgroundColor: "#ffe6e6", // Rosso chiaro per utenti bannati
}));

// Definizione della pagina con il tipo corretto
const UsersPage = ({ users }: { users: User[] }) => {
  const [, setUserList] = useState(users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const results = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [searchTerm, users]);

  const handleBan = async (banDuration: number) => {
    if (!selectedUserId) return;

    const res = await fetch(`/api/admin/users/${selectedUserId}/ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ banDuration }),
    });

    if (res.ok) {
      alert("Utente bannato con successo");
      setUserList((prev) =>
        prev.map((user) =>
          user._id === selectedUserId ? { ...user, role: "banned" } : user
        )
      );
    } else {
      alert("Errore nel bannare l'utente");
    }
  };

  const openBanModal = (id: string) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeBanModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Sei sicuro di voler eliminare questo utente?");
    if (!confirmed) return;

    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Utente eliminato con successo");
      setUserList((prev) => prev.filter((user) => user._id !== id));
    } else {
      alert("Errore nell'eliminazione dell'utente");
    }
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Gestione Utenti
      </Typography>

      {/* Barra di ricerca */}
      <TextField
        label="Cerca utenti"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ruolo</TableCell>
              <TableCell>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) =>
              user.role == "banned" ? (
                <BannedRow key={user._id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        router.push(`/admin/users/${user._id}/edit`)
                      }
                    >
                      Modifica
                    </Button>
                    <Button
                      onClick={() => openBanModal(user._id)}
                      color="warning"
                    >
                      Banna
                    </Button>
                    <Button
                      onClick={() => handleDelete(user._id)}
                      color="error"
                    >
                      Elimina
                    </Button>
                  </TableCell>
                </BannedRow>
              ) : (
                <TableRow key={user._id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        router.push(`/admin/users/${user._id}/edit`)
                      }
                    >
                      Modifica
                    </Button>
                    <Button
                      onClick={() => openBanModal(user._id)}
                      color="warning"
                    >
                      Banna
                    </Button>
                    <Button
                      onClick={() => handleDelete(user._id)}
                      color="error"
                    >
                      Elimina
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>
      <BanUserModal
        open={isModalOpen}
        onClose={closeBanModal}
        onBan={handleBan}
      />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withAdminAuth(
  async (context: GetServerSidePropsContext) => {
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
      jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };

      await dbConnect();
      const users = await User.find().lean();

      return {
        props: {
          users: JSON.parse(JSON.stringify(users)),
        },
      };
    } catch {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }
);

export default UsersPage;
