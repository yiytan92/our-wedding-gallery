import React from 'react';
import { FaWhatsappSquare, FaInstagramSquare } from 'react-icons/fa';

function InvitationCard() {
  return (
    <div className="flex flex-col items-center justify-center bg-lightcream">
      <h1 class="title">Contact Us</h1>
      <a className="flex justify-center" href="https://wa.me/+6598133977" target="_blank" rel="noopener noreferrer">
        <FaWhatsappSquare style={{ color: '#25D366', fontSize: '40px' }} /> <div className="text-lg pt-1">+65 9813 3977 (Yi Yang)</div>
      </a>
      <a className="flex justify-center" href="https://wa.me/+6589220455" target="_blank" rel="noopener noreferrer">
        <FaWhatsappSquare style={{ color: '#25D366', fontSize: '40px' }} /> <div className="text-lg pt-1">+65 8922 0455 (Qing Jing)</div>
      </a>
      <div className="flex justify-center">
        <a className="flex justify-center" href="https://www.instagram.com/stepheny92/" target="_blank" rel="noopener noreferrer">
          <FaInstagramSquare style={{ fontSize: '32px' }} /> <div className="text-lg pt-1">Bride</div>
        </a>
        <a className="flex justify-center" href="https://www.instagram.com/yiyang92/" target="_blank" rel="noopener noreferrer">
          <FaInstagramSquare style={{ fontSize: '32px' }} /> <div className="text-lg pt-1">Groom</div>
        </a>
      </div>
      <h1 class="title">Penang Travel Guide</h1>
      <div class="paragraph">Welcome to Penang! Here are some of the places we recommend you to visit:</div>
      <iframe title="Street Mural Locations" src="https://www.google.com/maps/d/embed?mid=1l4NJ1MDeMcvqyV9mEWpmI4v-WH_Z0Z3f&ehbc=2E312F" width="640" height="480"></iframe>
      <section class="food-recommendations">
        <h2>Food Recommendations</h2>
        <ul>
          <li>
            <strong>Penang Street Food with Air Conditioning:</strong>
            <ul>
              <li><a href="https://maps.app.goo.gl/dcaPurePPSd2mevL8?g_st=ic" target="_blank" rel="noopener noreferrer">OO White Coffee Waterfall</a></li>
              <li><a href="https://g.co/kgs/QQzo8WX" target="_blank" rel="noopener noreferrer">Kopi Kia 咖比仔 </a></li>
            </ul>
          </li>
          <li>
            <strong>Nyonya Food:</strong>
            <a href="https://maps.app.goo.gl/PtcqxdWRwLsFDE9x9?g_st=ic" target="_blank" rel="noopener noreferrer">Auntie Gaik Lean's Old School Eatery
            </a>
          </li>
          <li>
            <strong>Chinese Cuisine:</strong>
            <ul>
              <li><a href="https://maps.app.goo.gl/dU8fmnmVuy12NrBh6?g_st=ic" target="_blank" rel="noopener noreferrer">Tek Sen</a></li>
              <li><a href="https://maps.app.goo.gl/Mv4fPhoHzWnuYLEG8?g_st=ic" target="_blank" rel="noopener noreferrer">Foong Wei Heong Restaurant
              </a></li>
              <li><a href="https://maps.app.goo.gl/jSYtLoxBgEw4UPue8?g_st=ic" target="_blank" rel="noopener noreferrer">Ocean Green Restaurant
              </a></li>
            </ul>
          </li>
          <li>
            <strong>Famous Kway Chap and Hawker:</strong>
            <a href="https://maps.app.goo.gl/e1aqiLLnFVYTSLWx8?g_st=ic" target="_blank" rel="noopener noreferrer">Kimberley Street Duck Kway Chap
            </a>
          </li>
          <li>
            <strong>Hawker Centre:</strong>
            <a href="https://g.co/kgs/mrzYc4G" target="_blank" rel="noopener noreferrer">New World Park
            </a>
          </li>
          <li>
            <strong>Indian Cuisine:</strong>
            <a href="https://g.co/kgs/64aFmXm" target="_blank" rel="noopener noreferrer">Passions of Kerala Restaurant
            </a>
          </li>

        </ul>
      </section>
    </div>
  );
}
//https://g.co/kgs/64aFmXm
export default InvitationCard;
