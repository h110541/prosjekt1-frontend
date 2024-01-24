import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NyTest() {
  const [host, setHost] = useState('');
  const [hosts, setHosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHosts() {
      const response = await fetch("/api/hosts");
      const data = await response.json();
      setHosts(data);

      if (data[0] !== undefined) {
        setHost(data[0]);
      }
    }

    fetchHosts();
  }, []);

  async function handleStartTest() {
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: host })
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
    <div>
      <h1>Ny test</h1>
      <label>Host:
        <select value={host} onChange={e => setHost(e.target.value)}>
          {hosts.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </label>
      <br />
      <button onClick={handleStartTest}>Start test</button>
    </div>
  );
}
