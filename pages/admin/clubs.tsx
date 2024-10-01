import { GetServerSideProps } from "next";
import AdminLayout from "../../components/AdminLayout";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import dbConnect from "../../lib/mongodb";
import Club from "@/lib/models/Club"; // Il modello dei club
import { withAdminAuth } from "@/lib/withAdminAuth";
import { useState } from "react";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

interface Club {
  _id: string;
  name: string;
  address: string;
  city: string;
}

interface ClubsPageProps {
  clubs: Club[];
}

const ClubsPage = ({ clubs }: ClubsPageProps) => {
  const [clubList, setClubList] = useState(clubs); // Inizializza con i dati provenienti da getServerSideProps
  const router = useRouter();

  const handleEditClub = (clubId: string) => {
    // Reindirizza alla pagina di modifica del club
    router.push(`/admin/clubs/edit/${clubId}`);
  };

  const handleDeleteClub = async (clubId: string) => {
    try {
      await axios.delete(`/api/clubs/${clubId}`);
      setClubList(clubList.filter((club) => club._id !== clubId)); // Aggiorna lo stato rimuovendo il club cancellato
    } catch (error) {
      console.error("Errore durante l'eliminazione del club:", error);
    }
  };

  const handleAddNewClub = () => {
    router.push("/admin/clubs/new");
  };

  return (
    <AdminLayout>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4">Gestione Club</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddNewClub}
        >
          Aggiungi Nuovo Club
        </Button>
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Indirizzo</TableCell>
              <TableCell>Città</TableCell>
              <TableCell>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubList?.map((club) => (
              <TableRow key={club._id}>
                <TableCell>{club.name}</TableCell>
                <TableCell>{club.address}</TableCell>
                <TableCell>{club.city}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClub(club._id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClub(club._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  );
};

// Funzione per ottenere i dati lato server
export const getServerSideProps: GetServerSideProps = withAdminAuth(
  async () => {
    await dbConnect();
    const clubs = await Club.find().lean();

    return {
      props: {
        clubs: JSON.parse(JSON.stringify(clubs)), // Passa i club come prop
      },
    };
  }
);

export default ClubsPage;
