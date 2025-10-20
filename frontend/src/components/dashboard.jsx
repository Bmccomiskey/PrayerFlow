import React, { useState } from 'react';
import PrayerCard from './prayer_card.jsx';

// --- Placeholder Data ---
// In a real application, this data would be fetched from your backend API.
// We're using this mock data to build the UI without needing the backend to be ready.
const mockPrayerRequests = [
  { id: 1, name: 'John Smith', request: 'Surgery on Tuesday morning for a torn ACL.', status: 'New (Triage)', urgency: 'Urgent' },
  { id: 2, name: 'Jane Doe', request: 'Praise report! My son found a new job.', status: 'New (Triage)', urgency: 'Standard' },
  { id: 3, name: 'The Miller Family', request: 'Ongoing financial struggles after a layoff.', status: 'My Active Care', urgency: 'Standard' },
  { id: 4, name: 'Bob Richards', request: 'Comfort for the family after the passing of his mother.', status: 'My Active Care', urgency: 'Urgent' },
  { id: 5, name: 'Sarah Green', request: 'Check in on how her husband\'s new treatment is going.', status: 'Scheduled Check-ins', urgency: 'Standard' },
];
// --- End of Placeholder Data ---

function Dashboard() {
  // Use React's `useState` hook to manage the list of prayer requests.
  // We initialize it with our placeholder data.
  const [requests, setRequests] = useState(mockPrayerRequests);

  // Filter the requests into separate arrays for each column based on their status.
  // This makes it easy to render them in the correct sections.
  const newRequests = requests.filter(req => req.status === 'New (Triage)');
  const activeRequests = requests.filter(req => req.status === 'My Active Care');
  const scheduledRequests = requests.filter(req => req.status === 'Scheduled Check-ins');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>PrayerFlow Dashboard</h1>
        {/* A real app would have a user profile/logout button here */}
        <button className="logout-button">Log Out</button>
      </header>

      <main className="dashboard-main">
        {/* Column 1: New Requests */}
        <div className="dashboard-column">
          <h2>New (Triage)</h2>
          <div className="card-list">
            {newRequests.map(request => (
              <PrayerCard key={request.id} request={request} />
            ))}
          </div>
        </div>

        {/* Column 2: Active Care */}
        <div className="dashboard-column">
          <h2>My Active Care</h2>
          <div className="card-list">
            {activeRequests.map(request => (
              <PrayerCard key={request.id} request={request} />
            ))}
          </div>
        </div>

        {/* Column 3: Scheduled Check-ins */}
        <div className="dashboard-column">
          <h2>Scheduled Check-ins</h2>
          <div className="card-list">
            {scheduledRequests.map(request => (
              <PrayerCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;