import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Portunus</h3>
        <ul>
          <li>Home</li>
          <li>Documents</li>
          <li>Audits</li>
          <li>Incidents</li>
          <li>Notifications</li>
        </ul>
      </aside>

      <div className="main-content">
        <header className="header">
          <h2>Dashboard</h2>
        </header>

        <div className="content">
          <p>Welcome to your dashboard!</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
