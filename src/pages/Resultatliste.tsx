import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";

interface ResultShortType {
  id: string;
  status: "running" | "finished";
  created: string;
}

export default function Resultatliste() {
  const [resultater, setResultater] = useState<ResultShortType[]>([]);

  useEffect(() => {
    async function fetchResultatliste() {
      const response = await fetch("/api/network-tests-list");
      const data = await response.json();
      setResultater(data);
    }

    fetchResultatliste();
  }, []);

  const listItems = resultater.map(r => {
    return (
      <li key={r.id}>
        <Link to={`/resultat/${r.id}`}>{r.id}</Link>{' '}
        {r.created} status: {r.status}
      </li>
    );
  });

  return (
    <>
      <Navbar />
      <main>
        <h1>Resultatliste</h1>
        {resultater.length > 0 && (
          <ul className="resultatliste">{listItems}</ul>
        )}
      </main>
    </>
  );
}
