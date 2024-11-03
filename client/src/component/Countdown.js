import { useEffect, useState } from 'react';

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const eventDate = new Date("November 16, 2024 19:00:00").getTime();

    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        setTimeLeft({ isExpired: true });
        clearInterval(countdownInterval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isExpired: false
        });
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(countdownInterval);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div id="countdown" className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">Countdown to the Big Day!</h2>
      <div className="text-xl">
        {timeLeft.isExpired ? (
          "The big day is here!"
        ) : (
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="font-bold">{timeLeft.days}</div>
              <div className="text-sm">Days</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{timeLeft.hours}</div>
              <div className="text-sm">Hours</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{timeLeft.minutes}</div>
              <div className="text-sm">Minutes</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{timeLeft.seconds}</div>
              <div className="text-sm">Seconds</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Countdown; 
