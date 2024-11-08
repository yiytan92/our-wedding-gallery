import React from 'react';

function Venue() {
  return (
    <div className="bg-lightcream pb-5 mb-5">

      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Schedule</h2>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-24 font-medium">6:00 PM</div>
            <div className="w-4 h-4 rounded-full bg-gold mx-4"></div>
            <div>Cocktail Reception</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">7:00 PM</div>
            <div className="w-4 h-4 rounded-full bg-gold mx-4"></div>
            <div>Dinner Begins</div>
          </div>
          <div className="flex items-center">
            <div className="w-24 font-medium">10:00 PM</div>
            <div className="w-4 h-4 rounded-full bg-gold mx-4"></div>
            <div>Dinner Ends</div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-center mt-6 mb-6">Venue:  Eastern & Oriental Hotel, Penang</h2>
      <iframe
        title="E&O Hotel Macalister Ballroom"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d870.8249333587147!2d100.33434717806726!3d5.423673239273447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac39b073008ab%3A0xf3b83438062f2fb!2sEastern%20%26%20Oriental%20Hotel%2C%20Penang!5e0!3m2!1sen!2ssg!4v1730302773349!5m2!1sen!2ssg" width="100%" height="450" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

    </div>
  );
}

export default Venue;

