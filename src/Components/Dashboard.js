import React from 'react'
import Clientform from './Clientform';

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <a href="#">Home</a>
          <a href="#">Clients</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      <main className="main">
        <Clientform />
      </main>
    </div>
  );
}

export default Dashboard