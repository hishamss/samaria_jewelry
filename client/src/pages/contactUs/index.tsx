import React from "react";
import "./index.css"


const Contact = () => {
    return <div className="container contact-cont">
        <div className="contact-header mb-5">Contact Us</div>
        {/* <div className="contact-body mb-5">

            <div className="mb-5"><i className="fas fa-map-marker-alt contact-icons"><span className="ms-3 contact-text">451 George Wallace Dr, Gadsden, AL 35903</span></i></div>
            <div className="mb-5"><i className="fas fa-envelope contact-icons"><span className="ms-3 contact-text">samariacrafts@gmail.com</span></i></div>
            <div className="mb-5"><i className="fas fa-phone contact-icons"><span className="ms-3 contact-text">(256) 441-5812</span></i></div>
            <div className="mb-5"><i className="fab fa-facebook-square contact-icons"><span className="ms-3 contact-text">
                <a id='facebook-link' href="https://www.facebook.com/Samaria-crafts-of-the-holy-land-159715761423664/" target="_blank" rel="noreferrer">facebook page</a></span></i></div>
        </div> */}

        <div className="contact-body mb-5 d-flex justify-content-center">
        <div className="w-40 text-start"><div className="mb-5"><i className="fas fa-map-marker-alt contact-icons"><span className="ms-3 contact-text">451 George Wallace Dr, Gadsden, AL 35903</span></i></div>
            <div className="mb-5"><i className="fas fa-envelope contact-icons"><span className="ms-3 contact-text">samariacrafts@gmail.com</span></i></div>
            <div className="mb-5"><i className="fas fa-phone contact-icons"><span className="ms-3 contact-text">(256) 441-5812</span></i></div>
            <div className="mb-5"><i className="fab fa-facebook-square contact-icons"><span className="ms-3 contact-text">
                <a id='facebook-link' href="https://www.facebook.com/Samaria-crafts-of-the-holy-land-159715761423664/" target="_blank" rel="noreferrer">facebook page</a></span></i></div></div>
            
        </div>
    </div>
}

export default Contact;