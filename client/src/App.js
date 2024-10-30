import { useEffect, useState } from 'react';
import LoadingBar from './component/LoadingBar';
import Navbar from './component/NavBar';
import Schedule from './component/Schedule';
import Home from './component/Home';
import InvitationCard from './component/InvitationCard';
// import logo from './images/surnames.jpg';
// import invitationCard from './images/invitation-card.jpg';
// import invitationBanner from './images/invitation-card-banner.jpg';
import banner from './images/banner.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
          <h1 class="title">Share your precious moments from the wedding day with us! </h1>      </div>
      </div>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home bootstrapUrl={bootstrapUrl} />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/invitation" element={<InvitationCard />} />
            {/* Other Routes */}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
