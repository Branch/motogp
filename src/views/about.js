import React from 'react';



function About() {

    return <div className={'index-main-about'}>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#38B09D" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,202.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        <div className={'index-main-about-links container'}>
            <a target={"_blank"} href={"https://github.com/Branch/motogp"}><i className="fab fa-github"></i></a>
            <a href={"mailto:contact@domain.se"}><i className="fas fa-envelope"></i></a>
        </div>
    </div>
}

export default About;