// Import necessary dependencies
import React, {useRef, useState} from 'react'
import Main from './views/main';
import Results from './views/results';
import About from './views/about';
import Sidebar from './components/sidebar';
import GoToTop from './components/goToTop';
// Create App component
function App() {

    const startRef = useRef(null);
    const resultsRef = useRef(null);
    const aboutRef = useRef(null);
    const scrollToStart = () => {
        startRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest'});
    }
    const scrollToResults = (toggleMenu) => {
        if(toggleMenu) {
            sidebarToggler();
        }
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest'});
    }

    const scrollToResults2 = () => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest'});
    }
    const scrollToAbout = () => {
        sidebarToggler();
        aboutRef.current.scrollIntoView({ behavior: 'smooth', block: 'end'});
    }

    const [sidebarOpen, toggleSidebar] = useState(false)
    const [showGoToTop, toggleGoToTop] = useState(false)

    const sidebarToggler = () => {
        toggleSidebar(!sidebarOpen)
    }

    const handleScroll = () => {
        if(window.pageYOffset >= 695) {
            toggleGoToTop(true);
        } else {
            toggleGoToTop(false);
        }
    }

    window.addEventListener('scroll', handleScroll)

    return (
        <div className="app">
            <GoToTop
                show={showGoToTop}
                onClick={scrollToStart}
            />
            <div className={sidebarOpen ? 'overlay active' : 'overlay'}></div>
            <Sidebar
                onClose={sidebarToggler}
                active={sidebarOpen ? 'active' : ''}
                resultScroll={scrollToResults}
                aboutScroll={scrollToAbout}
            />
            <Main
                openSidebar={sidebarToggler}
                refProp={startRef}
                scroll={scrollToResults2}
            />
            <Results
                refProp={resultsRef}
            />
            <About
                refProp={aboutRef}
            />
        </div>
    )
}
export default App