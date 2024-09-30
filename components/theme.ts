import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#81c784", // Verde chiaro
    },
    secondary: {
      main: "#aed581", // Verde pastello
    },
    background: {
      default: "#f4f7f6", // Bianco sporco per sfondo
    },
  },
  typography: {
    fontFamily: `'Poppins', 'Arial', sans-serif`,
    h4: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#4caf50", // Verde naturale per titoli
    },
    body1: {
      fontSize: "1.125rem",
      color: "#4d4d4d", // Grigio per il testo
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "25px",
          padding: "10px 20px",
          textTransform: "none",
          backgroundColor: "#81c784",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#66bb6a", // Verde un po' più scuro
          },
        },
      },
    },
  },
});

export default theme;
