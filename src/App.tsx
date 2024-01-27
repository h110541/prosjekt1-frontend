import './App.css'
import { Route, Routes } from 'react-router-dom';
import NyTest from './pages/NyTest';
import Resultat from './pages/Resultat';
import Resultatliste from './pages/Resultatliste';

export default function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<NyTest />} />
        <Route path="/resultat/:id" element={<Resultat />} />
        <Route path="/resultatliste" element={<Resultatliste />} />
      </Routes>
    </div>
  );
}
