import React from 'react';

// The PrayerCard component receives a single `request` object as a "prop"
// and is only responsible for displaying that information.
function PrayerCard({ request }) {

  // A helper function to determine the CSS class for the urgency tag.
  // This allows us to style "Urgent" requests differently.
  const getUrgencyClass = () => {
    return request.urgency === 'Urgent' ? 'urgency-tag urgent' : 'urgency-tag standard';
  };

  return (
    // The main container for a single prayer card.
    <div className="prayer-card">
      <div className="card-header">
        <h3 className="card-name">{request.name}</h3>
        {/* The urgency tag is displayed with its determined style */}
        <span className={getUrgencyClass()}>{request.urgency}</span>
      </div>
      <p className="card-request-text">
        {request.request}
      </p>
      <div className="card-actions">
        {/* These are placeholder buttons for future functionality */}
        <button className="action-button">Add Note</button>
        <button className="action-button">Edit</button>
      </div>
    </div>
  );
}

export default PrayerCard;

