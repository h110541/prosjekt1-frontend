import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../Navbar";
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";

interface ResultShortType {
  id: string;
  status: "running" | "finished";
  created: string;
}

export default function Resultatliste() {
  const [resultater, setResultater] = useState<ResultShortType[]>([]);

  useEffect(() => {
    async function fetchResultatliste() {
      try {
        const response = await fetch("/api/network-tests-list");
        const data = await response.json();
        setResultater(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchResultatliste();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{
        my: 10,
        mx: 'auto',
        width: 0.6,
        maxWidth: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        <Typography variant="h2" component="h1">Resultatliste</Typography>

        {resultater.length > 0 && (
          <List>
            {resultater.map(r => (
              <ListItem key={r.id} disablePadding>
                <ListItemButton component={RouterLink} to={`/resultat/${r.id}`}>
                  <ListItemText primary={r.id} secondary={r.created} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
}
