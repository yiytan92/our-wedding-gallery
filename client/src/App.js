import { useEffect, useState } from 'react';
import LoadingBar from './component/LoadingBar';
import Navbar from './component/NavBar';
import Schedule from './component/Schedule';
import Home from './component/Home';
import InvitationCard from './component/InvitationCard';
import Venue from './component/Venue';
import Countdown from './component/Countdown';
import banner from './images/banner.png';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './component/Admin';

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
    <Router>
      <div>
        <div className="bg-lightcream">
          <div className='banner'>
            <img src={banner} alt="" width="100%" />
          </div>
          <div className='next-section'>
            <h1 className="title">Share your precious moments from the wedding day with us!</h1>
          </div>
          <Countdown />
        </div>
        <div className="bg-lightcream">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home bootstrapUrl={bootstrapUrl} />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/invitation" element={<InvitationCard />} />
            <Route path="/admin" element={<Admin bootstrapUrl={bootstrapUrl} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;
