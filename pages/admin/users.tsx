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
import AdminLayout from "../../components/AdminLayout";
import { withAdminAuth } from "@/lib/withAdminAuth";
import { parseCookies } from "nookies";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken"; // Per verificare il token JWT
import BanUserModal from "@/components/BanUserModal";
import router from "next/router";
import { styled } from "@mui/system";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
// Styled component per la riga rossa chiara
const BannedRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#ffe6e6", // Rosso chiaro per utenti bannati
}));
const UsersPage = ({ users }: { users: User[] }) => {
  const [userList, setUserList] = useState(users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    // Stato per la barra di ricerca
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);

  // Effetto per filtrare gli utenti in base alla barra di ricerca
  useEffect(() => {
    if (searchTerm === "") {
      // Se la barra di ricerca è vuota, mostra tutti gli utenti
      setFilteredUsers(users);
    } else {
      // Filtra gli utenti in base a nome, email o ruolo
      const results = users.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [searchTerm, users]);

  // Funzione per bannare l'utente con durata
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
      // Aggiorniamo lo stato per riflettere la modifica
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
  // Funzione per modificare l'utente

  // Funzione per eliminare l'utente
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
      // Aggiorniamo lo stato per rimuovere l'utente
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
          {filteredUsers.map((user) =>     user.role=="banned" ? (
                <BannedRow key={user._id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                  <Button onClick={() => router.push(`/admin/users/${user._id}/edit`)}>
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
                  <Button onClick={() => router.push(`/admin/users/${user._id}/edit`)}>
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
              ))}
  
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
export const getServerSideProps= withAdminAuth(async (context: { req: any; }) => {
  const { req } = context;

  // Otteniamo i cookie con parseCookies
  const cookies = parseCookies({ req });
  const token = cookies.token;

  // Se non c'è il token, reindirizziamo alla pagina di login
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Verifica del token JWT
  try {
  jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    // Connessione al database e recupero degli utenti
    await dbConnect();
    const users = await User.find().lean();

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)), // Serializziamo i dati per il passaggio lato client
      },
    };
  } catch {
    // Se il token non è valido o scaduto, reindirizziamo alla pagina di login
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
});


export default UsersPage;
