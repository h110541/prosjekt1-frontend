import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

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
      <main>
        <h1>Ny test</h1>

        {servers.length > 0 && (
          <>
            <label>Host:
              <select value={serverIndex} onChange={e => setServerIndex(Number(e.target.value))}>
                {servers.map((s, i) => <option key={i} value={i}>{s.host}</option>)}
              </select>
            </label>
            <br />
            <button onClick={handleStartTest}>Start test</button>
          </>
        )}

      </main>
    </>
  );
}
