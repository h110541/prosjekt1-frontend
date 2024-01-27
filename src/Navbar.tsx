import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Ny test</Link></li>
        <li><Link to="/resultatliste">Resultatliste</Link></li>
      </ul>
    </nav>
  );
}
