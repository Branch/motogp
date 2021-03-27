import React, {useEffect, useState} from 'react';
import Dropdown from '../components/dropdown';

function Results(props) {

    const [activeYear, assignYear] = useState({
        year: new Date().getFullYear(),
        dropdownOpen: false
    })
    const [activeRace, assignRace] = useState({
        race: '',
        dropdownOpen: false
    })

    const [activeCategory, assignCategory] = useState({
        category: '',
        dropdownOpen: false
    })

    const [activeSession, assignSession] = useState({
        session: '',
        dropdownOpen: false
    })

    const [activeType, assignType] = useState({
        type: 'Total standings',
        dropdownOpen: false
    })

    const typesInFilter = <span><div>Hej</div><div>Hopp</div></span>;
    const [yearsInFilter, assignYears] = useState([])
    const [racesInFilter, assignRaces] = useState([])
    const [categoriesInFilter, assignCategories] = useState([])
    const [sessionsInFilter, assignSessions] = useState([])
    const [resultsTable, setResultsTable] = useState([])
    const [sessionTable, setSessionTable] = useState([])
    const [tableHeader, setTableHeader] = useState([])
    const [sessionTableHeader, setSessionTableHeader] = useState([])
    const [races, setRaces] = useState([])

    const setYears = async () => {
        let years = [];

        for(let i = new Date().getFullYear(); i >= 2015; i--) {
            years.push(i)
        }
        let elements = years.map((year) =>
            <div onClick={() => yearClick(year)}>{year}</div>
        )
        assignYears(elements)
    }

    const fetchRaces  = async (setDefault = false) => {
        const results = await fetch(`/motogp/races?` + new URLSearchParams({
            year: activeYear.year
        }))
        const data = await results.json();

        let races = JSON.parse(data.data)

        let raceElements = []
        let firstRace = '';

        let first = true;
        for (let key of Object.keys(races)) {
            if(first) {
                firstRace = races[key].shortname;
            }
            raceElements.push(races[key].shortname)
            first = false;
        }

        let elements = raceElements.map((race) =>
            <div onClick={() => raceClick(race)}>{race}</div>
        )
        assignRaces(elements)

        // Set active race when loading view
        if(setDefault) {
            assignRace({race:firstRace, dropdownOpen: false})
        }
    }

    const fetchCategories  = async (setDefault = false) => {
        const results = await fetch(`/motogp/categories?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race
        }))
        const data = await results.json();
        let categories = JSON.parse(data.data)

        let raceElements = []
        let first = true
        let firstCategory = ''
        for (let key of Object.keys(categories)) {
            if(first) {
                firstCategory = categories[key].name
            }
            raceElements.push(categories[key].name)
            first = false
        }

        let elements = raceElements.map((race) =>
            <div onClick={() => categoryClick(race)}>{race}</div>
        )
        assignCategories(elements)
        if(setDefault) {
            assignCategory({category:firstCategory, dropdownOpen: false})
        }
    }

    const fetchSessions  = async (setDefault = false) => {

        const results = await fetch(`/motogp/sessions?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race,
            category: activeCategory.category,
        }))

        const data = await results.json();

        let sessions = JSON.parse(data.data)

        let raceElements = []
        let first = true
        let firstSession = ''
        for (let key of Object.keys(sessions)) {
            if(first) {
                firstSession = sessions[key].name
            }
            raceElements.push(sessions[key].name)
            first = false
        }

        let elements = raceElements.map((race) =>
            <div onClick={() => sessionClick(race)}>{race}</div>
        )
        assignSessions(elements)
        if(setDefault) {
            sessionClick(firstSession)
        }
    }

    const yearClick = async (year) => {
        assignYear({year:year, dropdownOpen: false})
    }

    const raceClick = async (race) => {
        assignRace({race:race, dropdownOpen: false})
    }

    const categoryClick = async (category) => {
        assignCategory({category:category, dropdownOpen: false})
    }

    const sessionClick = async (session) => {
        assignSession({session:session, dropdownOpen: false})
    }

    const typeClick = async (type) => {
        assignType({type:type, dropdownOpen: false})
    }

    // Total standings
    const fetchResults = async () => {
        fetch(`/motogp/standings?` + new URLSearchParams({
                year: activeYear.year,
                race: activeRace.race,
                category: activeCategory.category
            }))
            .then(res => res.json()) // Process the incoming data
            .then(json => {
                let html = window.document.createElement('html');
                html.innerHTML = json.data
                let resultsTable = html.getElementsByTagName('table')[0]
                let rowCounter = 0;
                let newResultsTable = '';
                let leaderPoints = 0;
                let tmpPoints = 0;
                let diffToLeader = 0;
                let diffToAbove = 0;

                for (let row of resultsTable.rows)
                {
                    let cellCounter = 0;
                    if(rowCounter === 0) {
                        rowCounter++;
                        continue;
                    }
                    // Open tr
                    newResultsTable += '<tr>';
                    for(let cell of row.cells)
                    {
                        let val = cell.innerText;

                        // First cell, holds position in championship
                        if(cellCounter === 0) {
                            newResultsTable += `<td>#${val}</td>`
                            cellCounter++;
                            continue;
                        }
                        newResultsTable += `<td>${val}</td>`

                        // Hold points for leader
                        if(rowCounter === 1) {
                            leaderPoints = row.cells[row.cells.length-1].innerText;
                        }

                        // Hold points for current rider
                        if(cellCounter === row.cells.length-1) {
                            diffToLeader = leaderPoints - cell.innerText
                            diffToAbove = tmpPoints - cell.innerText

                            if(diffToLeader <= 0) {
                                diffToLeader = '-';
                            }
                            if(diffToAbove <= 0) {
                                diffToAbove = '-';
                            }

                            tmpPoints = cell.innerText;
                        }
                        cellCounter++;
                    }
                    // Close tr
                    newResultsTable += `<td>${diffToLeader}</td><td>${diffToAbove}</td></tr>`;
                    rowCounter++;
                }
                let tableHeader = '<tr>\n' +
                    '                        <th></th>\n' +
                    '                        <th>Rider</th>\n' +
                    '                        <th>Team</th>\n' +
                    '                        <th>Nationality</th>\n' +
                    '                        <th>Points</th>\n' +
                    '                        <th>Diff to #1</th>\n' +
                    '                        <th>Diff to rider ahead</th>\n' +
                    '                    </tr>';
                setResultsTable(newResultsTable)
                setTableHeader(tableHeader)
            })
    }

    const fetchSession = async () => {
        const results = await fetch(`/motogp/session?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race,
            category: activeCategory.category,
            session: activeSession.session,
        }))

        const data = await results.json()

        let html = window.document.createElement('html');
        html.innerHTML = data.data
        let resultsTable = html.getElementsByTagName('table')[0]
        let rowCounter = 0;
        let newResultsTable = '';
        let leaderPoints = 0;
        let tmpPoints = 0;
        let diffToLeader = 0;
        let diffToAbove = 0;

        for (let row of resultsTable.rows)
        {
            let cellCounter = 0;
            if(rowCounter === 0) {
                rowCounter++;
                continue;
            }
            // Open tr
            newResultsTable += '<tr>';
            for(let cell of row.cells)
            {
                let val = cell.innerText;

                // First cell, holds position in championship
                if(cellCounter === 0) {
                    newResultsTable += `<td>#${val}</td>`
                    cellCounter++;
                    continue;
                }
                newResultsTable += `<td>${val}</td>`

                // Hold points for leader
                if(rowCounter === 1) {
                    leaderPoints = row.cells[row.cells.length-1].innerText;
                }

                // Hold points for current rider
                if(cellCounter === row.cells.length-1) {
                    diffToLeader = leaderPoints - cell.innerText
                    diffToAbove = tmpPoints - cell.innerText

                    if(diffToLeader <= 0) {
                        diffToLeader = '-';
                    }
                    if(diffToAbove <= 0) {
                        diffToAbove = '-';
                    }

                    tmpPoints = cell.innerText;
                }
                cellCounter++;
            }
            // Close tr
            newResultsTable += `<td>${diffToLeader}</td><td>${diffToAbove}</td></tr>`;
            rowCounter++;
        }
        let tableHeader = '<tr>\n' +
            '                        <th></th>\n' +
            '                        <th>Pos</th>\n' +
            '                        <th>Num</th>\n' +
            '                        <th>Rider</th>\n' +
            '                        <th>nation</th>\n' +
            '                        <th>Team</th>\n' +
            '                        <th>Bike</th>\n' +
            '                        <th>Km/h</th>\n' +
            '                        <th>Time</th>\n' +
            '                        <th>Gap</th>\n' +
            '                    </tr>';
        setSessionTable(newResultsTable)
        setSessionTableHeader(tableHeader)
    }

    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {
        setYears()
    }, [])

    useEffect(() => {
        fetchRaces(true)
        fetchCategories(true)
    }, [activeYear.year])

    useEffect(() => {
        if(activeRace.race !== undefined) {
            fetchCategories(true)
        }
    }, [activeRace.race])

    useEffect(() => {
        if(activeCategory.category !== undefined) {
            fetchSessions(true)
        }
    }, [activeCategory.category])



    return <div className={'index-main-results'} ref={props.ref}>
        <div className={'index-main-results-inner container'}>
            <h2>
                <Dropdown
                    class = {'numbers'}
                    activeItem={activeYear.year}
                    onActiveClick = {() => assignYear({year:activeYear.year, dropdownOpen: activeYear.dropdownOpen !== true})}
                    listItems = {yearsInFilter}
                    isOpen={activeYear.dropdownOpen}
                />
                results
            </h2>
            <div className={'index-main-results-inner__filters'}>
                <div className={'index-main-results-inner__filters__filter active'}>
                    <Dropdown
                        class = {'races'}
                        activeItem={activeRace.race}
                        onActiveClick = {() => assignRace({race:activeRace.race, dropdownOpen: activeRace.dropdownOpen !== true})}
                        listItems = {racesInFilter}
                        isOpen={activeRace.dropdownOpen}
                    />
                </div>
                <div className={'index-main-results-inner__filters__filter active'}>
                    <Dropdown
                        class = {'categories'}
                        activeItem={activeCategory.category}
                        onActiveClick = {() => assignCategory({category:activeCategory.category, dropdownOpen: activeCategory.dropdownOpen !== true})}
                        listItems = {categoriesInFilter}
                        isOpen={activeCategory.dropdownOpen}
                    />
                    Category
                </div>
                <div className={'index-main-results-inner__filters__filter active'}>
                    <Dropdown
                        class = {'sessions'}
                        activeItem={activeSession.session}
                        onActiveClick = {() => assignSession({session:activeSession.session, dropdownOpen: activeSession.dropdownOpen !== true})}
                        listItems = {sessionsInFilter}
                        isOpen={activeSession.dropdownOpen}
                    />
                    Session
                </div>
                <Dropdown
                    class = {'type'}
                    activeItem={activeType.type}
                    onActiveClick = {() => assignType({type:activeType.type, dropdownOpen: activeType.dropdownOpen !== true})}
                    listItems = {[<div onClick={() => typeClick('Total standings')}>Total standings</div>, <div onClick={() => typeClick('Session')}>Session</div>]}
                    isOpen={activeType.dropdownOpen}
                />
            </div>
            {activeType.type === 'Total standings' &&
                <button onClick={fetchResults}>Go</button>
            }
            {activeType.type === 'Session' &&
            <button onClick={fetchSession}>Go</button>
            }
                {activeType.type === 'Total standings' &&
                    <table>
                        <thead dangerouslySetInnerHTML={{__html: tableHeader}}>
                        </thead>
                        <tbody dangerouslySetInnerHTML={{__html: resultsTable}}></tbody>
                    </table>
                }
                {activeType.type === 'Session' &&
                    <table>
                        <thead dangerouslySetInnerHTML={{__html: sessionTableHeader}}>
                        </thead>
                        <tbody dangerouslySetInnerHTML={{__html: sessionTable}}></tbody>
                    </table>
                }
        </div>
    </div>
}

export default Results;