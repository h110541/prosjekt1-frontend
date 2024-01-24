import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ResultatType {
  id: string;
  status: "running" | "finished";
  result: any;
}

type ResultatStateType = ResultatType | null;

export default function Resultat() {
  const [resultat, setResultat] = useState<ResultatStateType>(null);
  const timerId = useRef<number | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchResultat() {
      const response = await fetch(`/api/network-tests/${id}`);
      const data = await response.json();
      setResultat(data);

      if (data.status === "finished" && timerId.current !== null) {
        clearInterval(timerId.current);
      }
    }

    fetchResultat();

    if (timerId.current === null) {
      timerId.current = setInterval(fetchResultat, 1000);
    }
  }, [id]);

  return (
    <div>
      <h1>Resultat</h1>
      <p><strong>Test-ID:</strong> {id}</p>
      {resultat && resultat.status === "running" && <TestRunning />}
      {resultat && resultat.status === "finished" && <TestFinished resultat={resultat} />}
      <button onClick={() => navigate("/")}>Ny test</button>
    </div>
  );
}

function TestRunning() {
  return (
    <div>
      <h2>Testen kjører...</h2>
      <progress></progress>
    </div>
  );
}

function TestFinished({ resultat }: { resultat: ResultatType }) {
  const tabellRader = resultat.result.intervals.map((i: any, index: number) => (
    <tr key={index}>
      <td>{i.sum.start.toFixed(2)} – {i.sum.end.toFixed(2)} sec</td>
      <td>{sizeString(i.sum.bytes)}</td>
      <td>{rateString(i.sum.bits_per_second)}</td>
      <td>{i.sum.retransmits}</td>
      <td>{sizeString(i.streams[0].snd_cwnd)}</td>
    </tr>
  ));

  return (
    <div>
      <p>
        local <strong>{resultat.result.start.connected[0].local_host}</strong>{' '}
        port {resultat.result.start.connected[0].local_port}{' '}
        connected to{' '}
        <strong>{resultat.result.start.connected[0].remote_host}</strong>{' '}
        port {resultat.result.start.connected[0].remote_port}
      </p>

      <h2>Intervals</h2>
      <table>
        <thead>
          <tr>
            <th>Interval</th>
            <th>Transfer</th>
            <th>Bitrate</th>
            <th>Retr</th>
            <th>Cwnd</th>
          </tr>
        </thead>
        <tbody>
          {tabellRader}
        </tbody>
      </table>

      <h2>Summary</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Interval</th>
            <th>Transfer</th>
            <th>Bitrate</th>
            <th>Retr</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Sender</th>
            <td>{resultat.result.end.sum_sent.start.toFixed(2)} – {resultat.result.end.sum_sent.end.toFixed(2)} sec</td>
            <td>{sizeString(resultat.result.end.sum_sent.bytes)}</td>
            <td>{rateString(resultat.result.end.sum_sent.bits_per_second)}</td>
            <td>{resultat.result.end.sum_sent.retransmits}</td>
          </tr>
          <tr>
            <th scope="row">Receiver</th>
            <td>{resultat.result.end.sum_received.start.toFixed(2)} – {resultat.result.end.sum_sent.end.toFixed(2)} sec</td>
            <td>{sizeString(resultat.result.end.sum_received.bytes)}</td>
            <td>{rateString(resultat.result.end.sum_received.bits_per_second)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function sizeString(numBytes: number) {
  if (numBytes >= (1024 ** 4)) {
    return (numBytes / (1024 ** 4)).toFixed(1) + ' TiB';
  } else if (numBytes >= (1024 ** 3)) {
    return (numBytes / (1024 ** 3)).toFixed(1) + ' GiB';
  } else if (numBytes >= (1024 ** 2)) {
    return (numBytes / (1024 ** 2)).toFixed(1) + ' MiB';
  } else if (numBytes >= 1024) {
    return (numBytes / 1024).toFixed(1) + ' KiB';
  } else {
    return String(numBytes) + ' bytes';
  }
}

function rateString(bitsPerSecond: number) {
  if (bitsPerSecond >= (1000 ** 4)) {
    return (bitsPerSecond / (1000 ** 4)).toFixed(1) + ' Tbit/s';
  } else if (bitsPerSecond >= (1000 ** 3)) {
    return (bitsPerSecond / (1000 ** 3)).toFixed(1) + ' Gbit/s';
  } else if (bitsPerSecond >= (1000 ** 2)) {
    return (bitsPerSecond / (1000 ** 2)).toFixed(1) + ' Mbit/s';
  } else if (bitsPerSecond >= 1000) {
    return (bitsPerSecond / 1000).toFixed(1) + ' kbit/s';
  } else {
    return String(bitsPerSecond) + ' bit/s';
  }
}
