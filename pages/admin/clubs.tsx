import { GetServerSideProps } from "next";
import AdminLayout from "../../components/AdminLayout";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from "@mui/material";
import dbConnect from "../../lib/mongodb";
import Club from "@/lib/models/Club";  // Il modello dei club
import { withAdminAuth } from "@/lib/withAdminAuth";

interface Club {
  _id: string;
  name: string;
  city: string;
  state: string;
  active: boolean;
}

const ClubsPage = ({ clubs }: { clubs: Club[] }) => {
  const handleDelete = async (clubId: string) => {
    await fetch(`/api/clubs/delete/${clubId}`, {
      method: "DELETE",
    });
    // Ricarica la pagina dopo la cancellazione
    window.location.reload();
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Gestione Club
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome del Club</TableCell>
              <TableCell>Città</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell>Attivo</TableCell>
              <TableCell>Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club._id}>
                <TableCell>{club.name}</TableCell>
                <TableCell>{club.city}</TableCell>
                <TableCell>{club.state}</TableCell>
                <TableCell>{club.active ? "Sì" : "No"}</TableCell>
                <TableCell>
                  <Button color="primary" variant="contained" href={`/admin/clubs/edit/${club._id}`}>
                    Modifica
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => handleDelete(club._id)}
                    sx={{ ml: 2 }}
                  >
                    Elimina
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </AdminLayout>
  );
};

export const getServerSideProps= withAdminAuth(async (context: { req: any; }) => {
  await dbConnect();
  const clubs = await Club.find().lean();

  return {
    props: {
      clubs: JSON.parse(JSON.stringify(clubs)),
    },
  };
});

export default ClubsPage;
