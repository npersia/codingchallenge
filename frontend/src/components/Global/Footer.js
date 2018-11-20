import React, { Component } from 'react';
import './css/Footer.css';


class Footer extends Component {

  render() {
    return (
      <div className="Footer">
          <div className="text-center">
              <div className="container">
                  <div className="row">
                      <div className="col-md-4 p-4">
                          <h2 className="mb-4">Contact</h2>
                          <p className="m-0">
                              <a href="tel:+549 - 116 789 4313" className="text-white">+549 - 116 789 4313</a>
                          </p>
                          <p>
                              <a href="mailto:persianahuel@gmail.com" className="text-white">persianahuel@gmail.com</a>
                          </p>
                      </div>
                      <div className="col-md-4 p-4">
                          <h2 className="mb-4">Location</h2>
                          <p>
                              <a href="https://www.google.it/maps" className="text-white">2790 Juramento<br/>Capital Federal, Argentina</a>
                          </p>
                      </div>
                      <div className="col-md-4 p-4">
                          <h2 className="mb-4">Openings</h2>
                          <p>09:00 - 18:00 Mon/Fri </p>
                      </div>
                  </div>
              </div>
          </div>

      </div>
    );
  }
}

export default Footer;
