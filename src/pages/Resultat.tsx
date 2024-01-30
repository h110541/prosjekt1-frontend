import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { Box, LinearProgress, Typography } from "@mui/material";

interface ResultatType {
  id: string;
  status: "running" | "finished" | "failed";
  result?: any;
  failure_type?: string;
}

export default function Resultat() {
  const [resultat, setResultat] = useState<ResultatType | null>(null);
  const timerId = useRef<number | undefined>(undefined);
  const { id } = useParams();

  const errorMsgs: string[] = [];
  if (resultat?.failure_type) {
    errorMsgs.push(resultat.failure_type);
  }
  if (resultat?.result?.error) {
    errorMsgs.push(resultat.result.error);
  }

  useEffect(() => {
    async function fetchResultat() {
      try {
        const response = await fetch(`/api/network-tests/${id}`);
        const data: ResultatType = await response.json();
        setResultat(data);

        if (data.status === "finished" || data.status === "failed") {
          clearInterval(timerId.current);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchResultat();

    if (timerId.current === undefined) {
      timerId.current = setInterval(fetchResultat, 1000);
    }

  }, [id]);

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
        <Typography variant="h2" component="h1">Resultat</Typography>
        <p><strong>Test-ID:</strong> {id}</p>
        {resultat && resultat.status === "running" && <TestRunning />}
        {resultat && resultat.status === "finished" && <TestFinished resultat={resultat} />}
        {errorMsgs.length > 0 && <ErrorMsg errorMessages={errorMsgs} />}
      </Box>
    </>
  );
}

function TestRunning() {
  return (
    <>
      <Typography variant="h4" component="h2">Testen kjører...</Typography>
      <LinearProgress sx={{ minWidth: 300, m: 2 }} />
    </>
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

function ErrorMsg({ errorMessages }: { errorMessages: string[] }) {
  return (
    <div>
      <h2>Error</h2>
      {errorMessages.map((msg, i) => <p key={i}>{msg}</p>)}
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
