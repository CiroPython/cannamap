import { GetServerSideProps } from "next";
import AdminLayout from "../../components/AdminLayout";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import dbConnect from "../../lib/mongodb";
import ClubFrom from "@/lib/models/ClubFrom";  // Il modello dei formulari
import { withAdminAuth } from "@/lib/withAdminAuth";

interface Form {
  _id: string;
  senderName: string;
  clubName: string;
  state: string;
  province: string;
  city: string;
  contactEmail: string;
}

const FormsPage = ({ forms }: { forms: Form[] }) => {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Formulari Inviati
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome del Mittente</TableCell>
              <TableCell>Nome del Club</TableCell>
              <TableCell>Email di Contatto</TableCell>
              <TableCell>Provincia</TableCell>
              <TableCell>Città</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form._id}>
                <TableCell>{form.senderName}</TableCell>
                <TableCell>{form.clubName}</TableCell>
                <TableCell>{form.contactEmail}</TableCell>
                <TableCell>{form.province}</TableCell>
                <TableCell>{form.city}</TableCell>
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
  const forms = await ClubFrom.find().lean();

  return {
    props: {
      forms: JSON.parse(JSON.stringify(forms)),  // Serializziamo i dati per il passaggio lato client
    },
  };
});

export default FormsPage;
