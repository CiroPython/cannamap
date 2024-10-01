import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

interface BanUserModalProps {
  open: boolean;
  onClose: () => void;
  onBan: (banDuration: number) => void;
}

const BanUserModal = ({ open, onClose, onBan }: BanUserModalProps) => {
  const [banDuration, setBanDuration] = useState<number>(0);

  const handleBan = () => {
    onBan(banDuration);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
          minWidth: 300,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Imposta la durata del ban (in giorni)
        </Typography>
        <TextField
          type="number"
          fullWidth
          label="Giorni di Ban"
          value={banDuration}
          onChange={(e) => setBanDuration(Number(e.target.value))}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBan}
            fullWidth
          >
            Conferma Ban
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BanUserModal;
