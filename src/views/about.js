import React from 'react';
import Background from '../assets/images/about-bg.svg';

function About(props) {

    return <div className={'index-main-about'} ref={props.refProp}>
        <img className={'index-main-about__bg'} alt={'background'} src={Background} />
        <div className={'index-main-about-inner container'}>
            <h2 className={""}>
                About
            </h2>
            <p>
                This site is a hobby of mine, meant to be an improvement of the results page that you can find on <a href={'https://www.motogp.com/en/Results+Statistics'} rel="noopener noreferrer" target={'_blank'}>motogp.com<i className="fas fa-external-link-alt"></i></a>
            </p>
            <p>
                Want to report a bug or just want to say hi? Send me an email and I'll try to get back to you as soon as possible.
            </p>
        </div>
        <div className={'index-main-about-links container'}>
            <a href={"mailto:contact@domain.se"}><i className="fas fa-envelope"></i></a>
        </div>
        <div className={'index-main-about__from'}>Made in <img alt={'sweden'} src='https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/se.svg'/></div>
    </div>
}

export default About;