// Import necessary dependencies
import React, {useEffect, useRef, useState} from 'react'
import Main from './views/main';
import Results from './views/results';
import Snakes from './views/snakes';

import Mugello from './assets/images/tracks/mugello2.png';

// Create App component
function App() {

    const [menuClass, setMenuClass] = useState('')


    // Prepare state hook for welcome message
    const [welcomeMessage, setWelcomeMessage] = useState('')
    // Prepare state hook for users list

    // It specifies the shape of usersList state
    const [usersList, setUsersList] = useState([])
    // Create async function for fetching welcome message
    const fetchMessage = async () => {
        // Use Fetch API to fetch '/api' endpoint
        const message = await fetch('/api')
            .then(res => res.text()) // process incoming data
        // Update welcomeMessage state
        setWelcomeMessage(message)
    }
    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {
        fetchMessage()
    }, [])

    const menuClick = (e) => {
        let className = e.currentTarget.classList.contains('is-active') ? '' : 'is-active';
        setMenuClass(className);
    }


    const resultsRef = React.createRef();
    const scrollToRef = (resultsRef) => window.scrollTo(0, resultsRef.current.offsetTop)


    return (
        <div className="app">
            <header className="app-header">
            </header>
            <Main
                scroll={scrollToRef}
            />
            <Results
                ref={resultsRef}
            />
        </div>
    )
}
export default App