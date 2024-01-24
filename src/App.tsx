import './App.css'
import { Route, Routes } from 'react-router-dom';
import NyTest from './pages/NyTest';
import Resultat from './pages/Resultat';

export default function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<NyTest />} />
        <Route path="/resultat/:id" element={<Resultat />} />
      </Routes>
    </div>
  );
}

