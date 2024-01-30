import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Button from '@mui/material/Button';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

interface ServerType {
  host: string;
  port: number;
}

export default function NyTest() {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [serverIndex, setServerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServerlist() {
      const response = await fetch("/api/servers");
      const data = await response.json();
      setServers(data);
      setServerIndex(0);
    }

    fetchServerlist();
  }, []);

  async function handleStartTest() {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: servers[serverIndex].host,
          port: servers[serverIndex].port
        })
      };

      const response = await fetch("/api/start-new-test", options);
      const data = await response.json();
      console.log(data);
      if (data.test_id) {
        navigate(`/resultat/${data.test_id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
        <Typography variant="h2" component="h1">Ny test</Typography>

        {servers.length > 0 && (
          <>
            <FormControl sx={{ m: 2, minWidth: 200 }}>
              <InputLabel>Host</InputLabel>
              <Select label="Host" value={serverIndex} onChange={e => setServerIndex(Number(e.target.value))}>
                {servers.map((s, i) => <MenuItem key={i} value={i}>{s.host}</MenuItem>)}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleStartTest}
            >
              Start test
            </Button>
          </>
        )}

      </Box>
    </>
  );
}
