import React, {useEffect, useState} from 'react';
import Marc from '../assets/images/fabio-tinted.png'
import Bg from '../assets/images/mobile-bg.svg'
import ScrollTo from "../components/scrollTo";
import Track from "../components/track";
function Index(props) {

    const apiUrl = process.env.NODE_ENV === 'production' ? 'https://motogp-worker.herokuapp.com' : '';

    const [firstOffset, setFirstOffset] = useState(0)
    const [showShareMenu, setShareMenuStatus] = useState(false)
    const [latestRace, setLatestRace] = useState({
        shortName: '',
        fullName: ''
    })

    const shareToggler = () => {
        setShareMenuStatus(!showShareMenu)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(firstOffset < 100) {
                setFirstOffset(firstOffset + 1)
            }
        }, 25)
        if(firstOffset === 100) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    })

    useEffect(() => {
        if(firstOffset <= 0) {
            getLatestRace();
        }
    })

    const getLatestRace = async () => {
        const results = await fetch(`${apiUrl}/motogp/latest`);
        const data = await results.json()
        let html = window.document.createElement('html');
        html.innerHTML = data.data
        let shortName = html.getElementsByTagName('select')[1].options[html.getElementsByTagName('select')[1].selectedIndex].value
        let fullName = '';

        if(shortName === 'FRA') {
            fullName = 'Le mans';
        } else if(shortName === 'ITA') {
            fullName = 'Mugello';
        } else if(shortName === 'QAT' || shortName === 'DOH') {
            fullName = 'Qatar';
        } else if(shortName === 'SPA') {
            fullName = 'Jerez';
        } else if(shortName === 'CAT') {
            fullName = 'Catalunya';
        } else if(shortName === 'GER') {
            fullName = 'Sachsenring';
        } else if(shortName === 'NED') {
            fullName = 'Assen';
        } else if(shortName === 'STY' || shortName === 'AUT') {
            fullName = 'Red bull ring';
        } else if(shortName === 'GBR') {
            fullName = 'Silverstone';
        } else if(shortName === 'ARA') {
            fullName = 'Aragon';
        } else if(shortName === 'RSM') {
            fullName = 'Misano';
        } else if(shortName === 'JPN') {
            fullName = 'Motegi';
        } else if(shortName === 'THA') {
            fullName = 'Chang';
        } else if(shortName === 'AUS') {
            fullName = 'Phillip Island';
        } else if(shortName === 'MAL') {
            fullName = 'Sepang';
        } else if(shortName === 'VAL') {
            fullName = 'Valencia';
        } else if(shortName === 'ARG') {
            fullName = 'Argentina';
        } else if(shortName === 'AME') {
            fullName = 'COTA';
        }

        setLatestRace({shortName: shortName, fullName: fullName})
    }



    return <div className={'index-main'} ref={props.refProp}>
        <img alt={'mobile background'} className={'mobile-bg'} src={Bg} />
        <button onClick={props.openSidebar} className={"hamburger"} type="button">
                <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                </span>
        </button>
        <button onClick={shareToggler} className={showShareMenu === true ? 'app-share active' : 'app-share'}>
            <i className="fas fa-share-alt"></i>
            <div className={'app-share__links'}>
                <a className={'facebook'} rel="noopener noreferrer" target={'_blank'} href={'https://www.facebook.com/sharer/sharer.php?u=http://stackoverflow.com'}><i className="fab fa-facebook-f"></i></a>
                <a className={'twitter'} rel="noopener noreferrer" target={'_blank'} href={'https://twitter.com/intent/tweet?text=http://mywebsite'}><i className="fab fa-twitter"></i></a>
                <a className={'reddit'} rel="noopener noreferrer" target={'_blank'} href={'https://www.reddit.com/submit?url=http://mywebsite'}><i className="fab fa-reddit"></i></a>
                <button className={'general'} rel="noopener noreferrer" onClick={() => {navigator.clipboard.writeText(window.location.href)}}><i className="fas fa-link"></i></button>
            </div>
        </button>
        <a className={'app-contact'} href={"mailto:contact@domain.se"}><i className="fas fa-envelope"></i></a>
        <div className={'app-latest'}>
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFA17A" d="M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z" />
            </svg>
            <div className={'app-latest-top'}>
                Latest race
            </div>
            <div className={'app-latest-track'}>
                <Track
                    track={latestRace.shortName}
                />
            </div>
            <div className={'app-latest-small'}>
                {latestRace.fullName}
            </div>
        </div>

        <svg className={'app-latest__race'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 650">
            <linearGradient id="grad-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset={firstOffset + "%"} />
                <stop offset="10%" />
            </linearGradient>
            <path fill={'url(#grad-bottom)'} d="M0,64L20,69.3C40,75,80,85,120,128C160,171,200,245,240,234.7C280,224,320,128,360,112C400,96,440,160,480,170.7C520,181,560,139,600,133.3C640,128,680,160,720,149.3C760,139,800,85,840,96C880,107,920,181,960,197.3C1000,213,1040,171,1080,128C1120,85,1160,43,1200,64C1240,85,1280,171,1320,186.7C1360,203,1400,149,1420,122.7L1440,96L1440,520L1420,520C1400,520,1360,520,1520,520C1280,520,1240,520,1200,520C1160,520,1120,520,1080,520C1040,520,1000,520,960,520C920,520,880,520,840,520C800,520,760,520,720,520C680,520,640,520,600,520C560,520,520,520,480,520C440,520,400,520,360,520C520,520,280,520,240,520C200,520,160,520,120,520C80,520,40,520,20,520L0,650Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 650">
            <linearGradient id="grad-mid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" />
                <stop offset="71%" />
            </linearGradient>
            <path fill={'url(#grad-mid)'} d="M0,64L20,69.3C40,75,80,85,120,128C160,171,200,245,240,234.7C280,224,320,128,360,112C400,96,440,160,480,170.7C520,181,560,139,600,133.3C640,128,680,160,720,149.3C760,139,800,85,840,96C880,107,920,181,960,197.3C1000,213,1040,171,1080,128C1120,85,1160,43,1200,64C1240,85,1280,171,1320,186.7C1360,203,1400,149,1420,122.7L1440,96L1440,520L1420,520C1400,520,1360,520,1520,520C1280,520,1240,520,1200,520C1160,520,1120,520,1080,520C1040,520,1000,520,960,520C920,520,880,520,840,520C800,520,760,520,720,520C680,520,640,520,600,520C560,520,520,520,480,520C440,520,400,520,360,520C520,520,280,520,240,520C200,520,160,520,120,520C80,520,40,520,20,520L0,650Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 650">
            <linearGradient id="grad-top" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" />
                <stop offset="71%" />
            </linearGradient>
            <path fill={'url(#grad-top)'} d="M0,64L20,69.3C40,75,80,85,120,128C160,171,200,245,240,234.7C280,224,320,128,360,112C400,96,440,160,480,170.7C650,181,560,139,600,133.3C640,128,680,160,720,149.3C760,139,800,85,840,96C880,107,920,181,960,197.3C1000,213,1040,171,1080,128C1120,85,1160,43,1200,64C1240,85,1280,171,1320,186.7C1360,203,1400,149,1420,122.7L1440,96L1440,650L1420,650C1400,650,1360,650,1650,650C1280,650,1240,650,1200,650C1160,650,1120,650,1080,650C1040,650,1000,650,960,650C920,650,880,650,840,650C800,650,760,650,720,650C680,650,640,650,600,650C560,650,650,650,480,650C440,650,400,650,360,650C650,650,280,650,240,650C200,650,160,650,120,650C80,650,40,650,20,650L0,650Z">
            </path>
        </svg>
        
        <div className={'index-main container'}>
            <ScrollTo
                onClick={props.scroll}
            />
            <div className={'index-main-title'}>
                <div className={'index-main-title-text'}>
                    <h1>Simple MotoGP results</h1>
                    <div className={'separator'}></div>
                    <p>This site is meant to show results from MotoGP in a simple and accessible way.<br />Note that this site is a hobby of mine and is<span className={'highlight'}> not affiliated with MotoGP / Dorna.</span></p>
                </div>
                <div className={'index-main-title-images'}>
                    <img alt={'fabio'} src={Marc} />
                    <img alt={'fabio'} src={Marc} />
                </div>
            </div>
        </div>
        <div className={'index-main-overlay'}></div>
    </div>
}

export default Index;