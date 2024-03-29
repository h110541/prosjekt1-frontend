// import './App.css'
import { Route, Routes } from 'react-router-dom';
import NyTest from './pages/NyTest';
import Resultat from './pages/Resultat';
import Resultatliste from './pages/Resultatliste';
import CssBaseline from '@mui/material/CssBaseline';

export default function App() {

  return (
    <div>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<NyTest />} />
        <Route path="/resultat/:id" element={<Resultat />} />
        <Route path="/resultatliste" element={<Resultatliste />} />
      </Routes>
    </div>
  );
}
