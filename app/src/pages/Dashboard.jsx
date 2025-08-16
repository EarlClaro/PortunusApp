import './Dashboard.css';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
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
