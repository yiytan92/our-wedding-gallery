import React from 'react';
import invitationCard from '../images/invitation-card.jpg';

function InvitationCard() {
  return (
    <div className="bg-lightcream pb-5 mb-5">
      <img src={invitationCard} alt="invitation-card" width="100%" />
    </div>
  );
}

export default InvitationCard;
