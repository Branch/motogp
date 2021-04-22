import React, {useEffect, useState} from 'react';
import Dropdown from '../components/dropdown';
import Loader from '../assets/images/wheel.svg';

function Results(props) {

    const [activeYear, assignYear] = useState({
        year: new Date().getFullYear(),
        dropdownOpen: false
    })
    const [activeRace, assignRace] = useState({
        race: '',
        raceName: '',
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

    const [loadingRaces, setLoadingRaces] = useState(false)
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [loadingSessions, setLoadingSessions] = useState(false)
    const [yearsInFilter, assignYears] = useState([])
    const [racesInFilter, assignRaces] = useState([])
    const [categoriesInFilter, assignCategories] = useState([])
    const [sessionsInFilter, assignSessions] = useState([])
    const [resultsTable, setResultsTable] = useState([])
    const [sessionTable, setSessionTable] = useState([])
    const [tableHeader, setTableHeader] = useState([])
    const [sessionTableHeader, setSessionTableHeader] = useState([])

    const setYears = async () => {
        let years = [];

        for(let i = new Date().getFullYear(); i >= 2012; i--) {
            years.push(i)
        }
        let elements = years.map((year) =>
            <div onClick={() => yearClick(year)}>{year}</div>
        )
        assignYears(elements)
    }

    const fetchRaces  = async () => {

        setLoadingRaces(true)

        const results = await fetch(`/motogp/races?` + new URLSearchParams({
            year: activeYear.year
        }))
        const data = await results.json();

        setLoadingRaces(false)

        let races = JSON.parse(data.data)

        let raceElements = []
        let firstRace = '';
        let firstRaceName = '';

        let first = true;
        let race = {}
        for (let key of Object.keys(races)) {
            race = {}
            if(first) {
                firstRace = races[key].shortname;
                firstRaceName = races[key].title;
            }
            race.race = races[key].shortname
            race.raceName = races[key].title
            raceElements.push(race)
            first = false;
        }

        let elements = raceElements.map((race) =>
            <div onClick={() => raceClick(race.race, race.raceName)}>{race.raceName}</div>
        )
        assignRaces(elements)

        // Set active race when loading view
        assignRace({race:firstRace, raceName:firstRaceName, dropdownOpen: false})

    }

    const fetchCategories  = async () => {
        setLoadingCategories(true);
        const results = await fetch(`/motogp/categories?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race
        }))
        const data = await results.json();
        setLoadingCategories(false);
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

        assignCategory({category:firstCategory, dropdownOpen: false})

    }

    const fetchSessions  = async () => {
        setLoadingSessions(true);
        const results = await fetch(`/motogp/sessions?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race,
            category: activeCategory.category,
        }))

        const data = await results.json();
        setLoadingSessions(false);
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
        assignSession({session:firstSession, dropdownOpen: false})

    }

    const yearClick = async (year) => {
        assignYear({year:year, dropdownOpen: false})
    }

    const raceClick = async (race, raceName) => {
        assignRace({race:race,raceName: raceName, dropdownOpen: false})
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
                cellCounter++;
            }
            // Close tr
            newResultsTable += `</tr>`;
            rowCounter++;
        }

        let showGap = activeSession.session.includes('RAC') ? '' : '<th>Gap to #1 / ahead</th>';
        let showPoints = activeSession.session.includes('RAC') ? '<th>Points</th>' : '';


        let tableHeader = '<tr>\n' +
            '                        <th></th>\n' +
                                    `${showPoints}\n` +
            '                        <th>Num</th>\n' +
            '                        <th>Rider</th>\n' +
            '                        <th>Nation</th>\n' +
            '                        <th>Team</th>\n' +
            '                        <th>Bike</th>\n' +
            '                        <th>Km/h</th>\n' +
            '                        <th>Time</th>\n' +
                                    `${showGap}\n` +
            '                    </tr>';
        setSessionTable(newResultsTable)
        setSessionTableHeader(tableHeader)
    }

    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {
        setYears()
    }, [])

    useEffect(() => {
        fetchRaces()
    }, [activeYear.year])

    useEffect(() => {
        if(activeRace.race !== undefined) {
            fetchCategories()
        }
    }, [activeRace.raceName])

    useEffect(() => {
        if(activeCategory.category !== undefined) {
            fetchSessions()
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
                    {loadingRaces === true &&
                        <img className={'loader'} src={Loader} />
                    }
                    {loadingRaces === false &&
                        <Dropdown
                            class = {'races'}
                            activeItem={activeRace.raceName}
                            onActiveClick = {() => assignRace({race:activeRace.race, raceName:activeRace.raceName, dropdownOpen: activeRace.dropdownOpen !== true})}
                            listItems = {racesInFilter}
                            isOpen={activeRace.dropdownOpen}
                        />
                    }
                </div>
                <div className={'index-main-results-inner__filters__filter active'}>
                    {loadingCategories === true &&
                        <img className={'loader'} src={Loader} />
                    }
                    {loadingCategories === false &&
                        <Dropdown
                            class = {'categories'}
                            activeItem={activeCategory.category}
                            onActiveClick = {() => assignCategory({category:activeCategory.category, dropdownOpen: activeCategory.dropdownOpen !== true})}
                            listItems = {categoriesInFilter}
                            isOpen={activeCategory.dropdownOpen}
                        />
                    }
                </div>
                <div className={'index-main-results-inner__filters__filter active'}>
                    {loadingSessions === true &&
                        <img className={'loader'} src={Loader} />
                    }
                    {loadingSessions === false &&
                        <Dropdown
                            class = {'sessions'}
                            activeItem={activeSession.session}
                            onActiveClick = {() => assignSession({session:activeSession.session, dropdownOpen: activeSession.dropdownOpen !== true})}
                            listItems = {sessionsInFilter}
                            isOpen={activeSession.dropdownOpen}
                        />
                    }
                </div>
                <Dropdown
                    class = {'type'}
                    activeItem={activeType.type}
                    onActiveClick = {() => assignType({type:activeType.type, dropdownOpen: activeType.dropdownOpen !== true})}
                    listItems = {[<div onClick={() => typeClick('Total standings')}>Total standings</div>, <div onClick={() => typeClick('Session')}>Session</div>]}
                    isOpen={activeType.dropdownOpen}
                />
            </div>
            {categoriesInFilter <= 0 &&
                <div className={'error-msg'}>
                    <div>There's no data for the selected race weekend.</div>
                    <div>This is most likely because the selected race weekend has no completed session yet, or it could be
                        a temporary issue with getting the race data.
                    </div>
                    <div>Please try again later.</div>
                </div>
            }
            <button disabled={categoriesInFilter <= 0 ? 'disabled' : ''} onClick={activeType.type === 'Total standings' ? fetchResults : fetchSession}>Go</button>
            <table>
                <thead dangerouslySetInnerHTML={{__html: activeType.type === 'Total standings' ? tableHeader : sessionTableHeader}}>
                </thead>
                <tbody dangerouslySetInnerHTML={{__html: activeType.type === 'Total standings' ? resultsTable : sessionTable}}></tbody>
            </table>
        </div>
    </div>
}

export default Results;