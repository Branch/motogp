// Import necessary dependencies
import React, {useRef} from 'react'
import Main from './views/main';
import Results from './views/results';
import About from './views/about';
// Create App component
function App() {

    const myRef = useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest'});


    return (
        <div className="app">
            <Main
                scroll={executeScroll}
            />
            <Results
                refProp={myRef}
            />
            <About />
        </div>
    )
}
export default App