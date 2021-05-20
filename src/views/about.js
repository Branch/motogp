import React from 'react';
import Background from '../assets/images/about-bg.svg';



function About() {

    return <div className={'index-main-about'}>
        <img src={Background} />
        <div className={'index-main-about-inner container'}>
            <h2 className={""}>
                About
            </h2>
            <p>
                This site is meant to be an improvement of the results page that you can find on <a href={'https://www.motogp.com/en/Results+Statistics'} target={'_blank'}>motogp.com.</a>
            </p>
            <p>
                This site is a hobby of mine and is not affiliated with MotoGP / Dorna.
            </p>
        </div>
        <div className={'index-main-about-links container'}>
            <a target={"_blank"} href={"https://github.com/Branch/motogp"}><i className="fab fa-github"></i></a>
            <a href={"mailto:contact@domain.se"}><i className="fas fa-envelope"></i></a>
        </div>
    </div>
}

export default About;