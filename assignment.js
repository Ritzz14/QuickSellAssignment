import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status'); // Default grouping by status
  const [sortBy, setSortBy] = useState('');

  // Fetch data from the API
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error('Error fetching tickets:', error));
  }, []);

  // Persist grouping state in localStorage
  useEffect(() => {
    const savedGrouping = localStorage.getItem('grouping');
    if (savedGrouping) {
      setGrouping(savedGrouping);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
  }, [grouping]);

  // Handle change in grouping selection
  const handleGroupingChange = (e) => {
    setGrouping(e.target.value);
  };

  // Handle sorting
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    
    if (sortValue === 'priority') {
      setTickets([...tickets].sort((a, b) => b.priority - a.priority));
    } else if (sortValue === 'title') {
      setTickets([...tickets].sort((a, b) => a.title.localeCompare(b.title)));
    }
  };

  // Group tickets based on grouping criteria
  const groupedTickets = tickets.reduce((groups, ticket) => {
    const groupKey = ticket[grouping]; // e.g., ticket.status, ticket.user, ticket.priority
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(ticket);
    return groups;
  }, {});

  return (
    <div className="App">
      <header>
        <h1>Kanban Board</h1>
        <div className="controls">
          <div className="grouping">
            <label htmlFor="grouping">Group by: </label>
            <select id="grouping" value={grouping} onChange={handleGroupingChange}>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="sorting">
            <label htmlFor="sorting">Sort by: </label>
            <select id="sorting" value={sortBy} onChange={handleSortChange}>
              <option value="">None</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </header>
      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="column">
            <h2>{group}</h2>
            {groupedTickets[group].map((ticket) => (
              <div key={ticket.id} className="card">
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
                <span>Priority: {ticket.priority}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
