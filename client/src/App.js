import { useEffect, useState } from 'react';
import LoadingBar from './component/LoadingBar';
import Navbar from './component/NavBar';
import Schedule from './component/Schedule';
import Home from './component/Home';
import InvitationCard from './component/InvitationCard';
import Venue from './component/Venue';
// import logo from './images/surnames.jpg';
// import invitationCard from './images/invitation-card.jpg';
// import invitationBanner from './images/invitation-card-banner.jpg';
import banner from './images/banner.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './component/Admin';

function countdown() {
  const eventDate = new Date("November 16, 2024 19:00:00").getTime();
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById("timer").innerHTML = "The big day is here!";
  }
}

const countdownInterval = setInterval(countdown, 1000);

function App({ bootstrapUrl }) {
  const [bootstrap, setBootstrap] = useState(undefined);

  useEffect(() => {
    fetch(bootstrapUrl)
      .then(response => response.json())
      .then(bootstrap => setBootstrap(bootstrap));
  }, [bootstrapUrl]);

  if (!bootstrap) {
    return <LoadingBar />;
  }

  return (
    <div>
      <div className="bg-lightcream">
        <div class='banner'>
          <img src={banner} alt="" width="100%" />
        </div>
        <div class='next-section'>
          <h1 class="title">Share your precious moments from the wedding day with us! </h1>
        </div>
        <div id="countdown">
          <h2>Countdown to the Big Day!</h2>
          <p id="timer"></p>
        </div>
      </div>
      <div className="bg-lightcream">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home bootstrapUrl={bootstrapUrl} />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/invitation" element={<InvitationCard />} />
            <Route path="/admin" element={<Admin bootstrapUrl={bootstrapUrl} />} />
            {/* Other Routes */}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
