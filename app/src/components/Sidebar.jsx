import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Portunus</h3>
      <ul>
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/documents">Documents</Link></li>
        <li><Link to="/audits">Audits</Link></li>
        <li><Link to="/incidents">Incidents</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;