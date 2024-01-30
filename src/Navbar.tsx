// import { Link } from "react-router-dom";
import { AppBar, ButtonGroup, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar sx={{ alignItems: 'center' }}>
      <Toolbar>
        <nav>
          <ButtonGroup color="inherit" variant="outlined">
            <Button onClick={() => navigate("/")}>Ny test</Button>
            <Button onClick={() => navigate("/resultatliste")}>Resultatliste</Button>
          </ButtonGroup>
        </nav>
      </Toolbar>
    </AppBar>
  );
}
