import React from "react";
import "./about.css";

function About() {
  return (
    <div className="About-container">
      <div className="About-card">
        <h1>About <span>tHE gAmE</span></h1>
        <p>
          <strong>tHE gAmE</strong> is a next-level student video chat room designed 
          to connect people instantly in the most engaging and cinematic way possible.  
        </p>
        <p>
          With a secure login system and seamless peer-to-peer video calling, 
          this platform allows you to join random rooms, meet new friends, 
          or collaborate with classmates in real-time.
        </p>
        <p>
          <em>Fast, secure, and aesthetic – because boring apps are out of style.</em>
        </p>
        <div className="About-footer">
          <p>Made with ❤️ using React, WebRTC, and Socket.io</p>
        </div>
      </div>
    </div>
  );
}

export default About;
