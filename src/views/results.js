import React, {useEffect, useState} from 'react';

function Results(props) {

    const [yearsList, setYears] = useState([])


    // Create async function for fetching users list
    const fetchYears = async () => {
        const years = await fetch('/motogp/years')
            .then(res => res.json()) // Process the incoming data
        // Update usersList state
        setYears(years)
    }



    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {
        fetchYears()
    }, [])



    return <div className={'index-main-results'} ref={props.ref}>
        <div className={'index-main-results-inner container'}>
            <h2>skaffa pdf läs lib, bäst så</h2>
            <div>{yearsList}</div>
        </div>
    </div>
}

export default Results;