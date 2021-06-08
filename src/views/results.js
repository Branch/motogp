import React, {useEffect, useState} from 'react';
import { Fade } from '@material-ui/core';
import Dropdown from '../components/dropdown';
import Weather from '../components/weather';
import Loader from '../assets/images/wheel.svg';
import Country from '../helpers/country';

function Results(props) {

    const apiUrl = process.env.NODE_ENV === 'production' ? 'https://motogp-worker.herokuapp.com' : '';

    const [activeYear, assignYear] = useState({
        year: new Date().getFullYear(),
        dropdownOpen: false
    })
    const [button, assignButtonStatus] = useState({
        disabled: false,
        clicked: false,
        loading: false,
    })

    const [error, setErrorStatus] = useState({
        status: false
    })

    const [filtersChanged, assignFilterStatus] = useState({
        changed: false,
    })
    const [activeRace, assignRace] = useState({
        race: '',
        raceName: '',
        dropdownOpen: false,
        prevRace: '',
        prevRacename: ''
    })

    const [activeCategory, assignCategory] = useState({
        category: '',
        dropdownOpen: false
    })

    const [activeSession, assignSession] = useState({
        session: '',
        dropdownOpen: false
    })

    const [activeSessionData, assignSessionData] = useState({
        track: '',
        air: '',
        raceLapRecord: '',
        sessionBestLapLap: '',
        sessionBestLapTime: '',
        sessionBestLapRider: '',
        sessionBestLapSpeed: '',
        lapRecordYear: '',
        lapRecordLapTime: '',
        lapRecordRider: '',
        lapRecordSpeed: '',
        raceLapRecordYear: '',
        raceLapRecordLapTime: '',
        raceLapRecordRider: '',
        raceLapRecordSpeed: '',
        poleLap: ''
    })

    const [activeType, assignType] = useState({
        type: 'Session',
        dropdownOpen: false
    })
    const [loadedSessionInfo, assignLoadedSessionInfo] = useState({
        text: '',
        visible: false,
        type: ''
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

    const setLoadedRaceInfo = async () => {
        let text = '';

        text = `Total standings as of ${activeRace.raceName}`;

        if(activeType.type === 'Session') {
            text = `${activeCategory.category} ${activeSession.session} of the ${activeRace.raceName}`;
        }
        assignLoadedSessionInfo({text: text, visible: true, type: activeType.type})
    }

    const yearClick = async (year) => {
        assignYear({year:year, dropdownOpen: false})
    }

    const raceClick = async (race, raceName) => {
        assignRace({race:race,raceName: raceName, dropdownOpen: false})
    }

    const categoryClick = async (category) => {
        let prevCategory = activeCategory.category;
        assignCategory({category:category, dropdownOpen: false, prev: prevCategory})
    }

    const sessionClick = async (session) => {
        assignSession({session:session, dropdownOpen: false})
    }

    const typeClick = async (type) => {
        assignType({type:type, dropdownOpen: false})
    }

    // Total standings
    const fetchResults = async () => {
        assignButtonStatus({clicked: true, loading: true, disabled: true})

        fetch(`${apiUrl}/motogp/standings?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race,
            category: activeCategory.category,
            session: 'RAC'
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

                        // Country flag
                        if(cellCounter === 3) {
                            let country = Country(val);

                            newResultsTable += `<td><img class='country-flag' src='https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${country}.svg' /></td>`
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
                assignButtonStatus({clicked: true, loading: false, disabled: false})
                setLoadedRaceInfo();
            })

    }

    const fetchSession = async () => {
        assignButtonStatus({clicked: true, loading: true, disabled: true})
        const results = await fetch(`${apiUrl}/motogp/session?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race,
            category: activeCategory.category,
            session: activeSession.session,
        }))

        const data = await results.json()

        let html = window.document.createElement('html');
        html.innerHTML = data.data
        let resultsTable = html.getElementsByTagName('table')[0]
        let sessionInfoTable = html.getElementsByTagName('table')[1]
        let sessionTrackInfo = html.getElementsByClassName('padright10')[0].innerText.split(' ')[2];
        let sessionWeatherInfo = html.getElementsByClassName('padright10')[1].innerText.split(' ')[1];
        let rowCounter = 0;
        let newResultsTable = '';
        let poleLapInfo = '';

        let sessionBestLapLap = '';
        let sessionBestLapTime = '';
        let sessionBestLapRider = '';
        let sessionBestLapSpeed = '';

        let lapRecordYear = '';
        let lapRecordLapTime = '';
        let lapRecordRider = '';
        let lapRecordSpeed = '';

        let raceLapRecordYear = '';
        let raceLapRecordLapTime = '';
        let raceLapRecordRider = '';
        let raceLapRecordSpeed = '';

        if(sessionInfoTable.rows.length === 4) {
            sessionBestLapLap = sessionInfoTable.rows[1].cells[1].innerText.split(' ')[1];
            sessionBestLapTime = sessionInfoTable.rows[1].cells[3].innerText;
            sessionBestLapRider = sessionInfoTable.rows[1].cells[2].innerText;
            sessionBestLapSpeed = sessionInfoTable.rows[1].cells[4].innerText;

            raceLapRecordYear = sessionInfoTable.rows[2].cells[1].innerText;
            raceLapRecordLapTime = sessionInfoTable.rows[2].cells[3].innerText;
            raceLapRecordRider = sessionInfoTable.rows[2].cells[2].innerText;
            raceLapRecordSpeed = sessionInfoTable.rows[2].cells[4].innerText;

            lapRecordYear = sessionInfoTable.rows[3].cells[1].innerText;
            lapRecordLapTime = sessionInfoTable.rows[3].cells[3].innerText;
            lapRecordRider = sessionInfoTable.rows[3].cells[2].innerText;
            lapRecordSpeed = sessionInfoTable.rows[3].cells[4].innerText;
        } else if (sessionInfoTable.rows.length === 3) {
            sessionBestLapLap = sessionInfoTable.rows[0].cells[1].innerText.split(' ')[1];
            sessionBestLapTime = sessionInfoTable.rows[0].cells[3].innerText;
            sessionBestLapRider = sessionInfoTable.rows[0].cells[2].innerText;
            sessionBestLapSpeed = sessionInfoTable.rows[0].cells[4].innerText;

            raceLapRecordYear = sessionInfoTable.rows[1].cells[1].innerText;
            raceLapRecordLapTime = sessionInfoTable.rows[1].cells[3].innerText;
            raceLapRecordRider = sessionInfoTable.rows[1].cells[2].innerText;
            raceLapRecordSpeed = sessionInfoTable.rows[1].cells[4].innerText;

            lapRecordYear = sessionInfoTable.rows[2].cells[1].innerText;
            lapRecordLapTime = sessionInfoTable.rows[2].cells[3].innerText;
            lapRecordRider = sessionInfoTable.rows[2].cells[2].innerText;
            lapRecordSpeed = sessionInfoTable.rows[2].cells[4].innerText;
        }

        assignSessionData({
            track: sessionTrackInfo,
            air: sessionWeatherInfo,
            sessionBestLapLap: sessionBestLapLap,
            sessionBestLapTime: sessionBestLapTime,
            sessionBestLapRider: sessionBestLapRider,
            sessionBestLapSpeed: sessionBestLapSpeed,
            lapRecordYear: lapRecordYear,
            lapRecordLapTime: lapRecordLapTime,
            lapRecordRider: lapRecordRider,
            lapRecordSpeed: lapRecordSpeed,
            raceLapRecordYear: raceLapRecordYear,
            raceLapRecordLapTime: raceLapRecordLapTime,
            raceLapRecordRider: raceLapRecordRider,
            raceLapRecordSpeed: raceLapRecordSpeed,
            poleLap: poleLapInfo
        })

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

                // Country flag
                if((activeSession.session.includes('RAC') && cellCounter === 4) || (!activeSession.session.includes('RAC') && cellCounter === 3)) {
                    let country = Country(val);

                    newResultsTable += `<td><img alt="country" class='country-flag' src='https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${country}.svg' /></td>`
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
        assignButtonStatus({clicked: true, loading: false, disabled: false})
        setLoadedRaceInfo();
    }

    const buttonClick = async () => {
        setErrorStatus({status: false})
        activeType.type === 'Total standings' ? fetchResults() : fetchSession();
        assignFilterStatus({changed: false})
    }

    const fetchSessions = async () => {
        setLoadingSessions(true);
        const results = await fetch(`${apiUrl}/motogp/sessions?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race,
            category: activeCategory.category,
        }))

        const data = await results.json();
        setLoadingSessions(false);
        let sessions = JSON.parse(data.data)

        if(sessions == null) {
            let elements = <div>No session available</div>
            assignSessions(elements)
            assignSession({session:'No session available', dropdownOpen: false})
            assignButtonStatus({clicked: false, loading: false, disabled: true})
            return;
        }

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
        assignButtonStatus({clicked: false, loading: false, disabled: false})

    }

    const fetchCategories = async () => {
        setLoadingCategories(true);
        const results = await fetch(`${apiUrl}/motogp/categories?` + new URLSearchParams({
            year: activeYear.year,
            race: activeRace.race
        }))
        const data = await results.json();
        setLoadingCategories(false);
        let categories = JSON.parse(data.data)

        if(categories.length <= 0) {
            setErrorStatus({status: true})
        } else if(error.status === true) {
            setErrorStatus({status: false})
        }

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

        assignCategory({category:firstCategory, dropdownOpen: false, prev: activeCategory.prev})

    }

    useEffect(() => {
        const setYears = () => {
            let years = [];

            for(let i = new Date().getFullYear(); i >= 2012; i--) {
                years.push(i)
            }
            let elements = years.map((year) =>
                <div onClick={() => yearClick(year)}>{year}</div>
            )
            assignYears(elements)
        }
        setYears();
    }, [])

    useEffect(() => {
        const fetchRaces = async () => {

            setLoadingRaces(true)

            const results = await fetch(`${apiUrl}/motogp/races?` + new URLSearchParams({
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
        fetchRaces();
    }, [activeYear.year, apiUrl])

    useEffect(() => {
        if(activeRace.race !== undefined && activeRace.race !== '') {
            fetchCategories()
        }

        if(activeCategory.category !== undefined && activeCategory.category !== '' && activeRace.race !== undefined && activeRace.race !== '') {
            fetchSessions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRace.raceName])

    useEffect(() => {
        if(activeCategory.category !== undefined && activeCategory.category !== '' && activeRace.race !== undefined && activeRace.race !== '') {
            fetchSessions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory.category])

    useEffect(() => {
        if(activeRace.dropdownOpen === true) {
            assignCategory({category:activeCategory.category, dropdownOpen: false, prev: activeCategory.prev})
            assignYear({year:activeYear.year, dropdownOpen: false})
            assignType({type:activeType.type, dropdownOpen: false})
            assignSession({session:activeSession.session, dropdownOpen: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeRace.dropdownOpen])

    useEffect(() => {
        if(activeCategory.dropdownOpen === true) {
            assignRace({race:activeRace.race, raceName:activeRace.raceName, dropdownOpen: false})
            assignYear({year:activeYear.year, dropdownOpen: false})
            assignType({type:activeType.type, dropdownOpen: false})
            assignSession({session:activeSession.session, dropdownOpen: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory.dropdownOpen])

    useEffect(() => {
        if(activeType.dropdownOpen === true) {
            assignCategory({category:activeCategory.category, dropdownOpen: false, prev: activeCategory.prev})
            assignYear({year:activeYear.year, dropdownOpen: false})
            assignRace({race:activeRace.race, raceName:activeRace.raceName, dropdownOpen: false})
            assignSession({session:activeSession.session, dropdownOpen: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeType.dropdownOpen])

    useEffect(() => {
        if(activeSession.dropdownOpen === true) {
            assignCategory({category:activeCategory.category, dropdownOpen: false, prev: activeCategory.prev})
            assignYear({year:activeYear.year, dropdownOpen: false})
            assignType({type:activeType.type, dropdownOpen: false})
            assignRace({race:activeRace.race, raceName:activeRace.raceName, dropdownOpen: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession.dropdownOpen])

    useEffect(() => {
        if(activeYear.dropdownOpen === true) {
            assignCategory({category:activeCategory.category, dropdownOpen: false, prev: activeCategory.prev})
            assignSession({session:activeSession.session, dropdownOpen: false})
            assignType({type:activeType.type, dropdownOpen: false})
            assignRace({race:activeRace.race, raceName:activeRace.raceName, dropdownOpen: false})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeYear.dropdownOpen])

    useEffect(() => {
        if(button.clicked === true) {
            assignFilterStatus({changed: true})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSession.session, activeYear.year, activeCategory.category, activeRace.race, activeType.type])

    return <div className={'index-main-results'} ref={props.refProp}>
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
                        <img alt={'loader'} className={'loader'} src={Loader} />
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
                {categoriesInFilter.length > 0 &&
                    <div className={'index-main-results-inner__filters__filter active'}>
                        {loadingCategories === true &&
                        <img alt={'loader'} className={'loader'} src={Loader} />
                        }
                        {loadingCategories === false &&
                        <Dropdown
                            class = {'categories'}
                            noOfCategories={categoriesInFilter.length}
                            activeItem={activeCategory.category}
                            onActiveClick = {() => assignCategory({category:activeCategory.category, dropdownOpen: activeCategory.dropdownOpen !== true, prev: activeCategory.prev})}
                            listItems = {categoriesInFilter}
                            isOpen={activeCategory.dropdownOpen}
                        />
                        }
                    </div>
                }
                {categoriesInFilter.length > 0 &&
                    <div className={'index-main-results-inner__filters__filter active'}>
                        {loadingSessions === true &&
                        <img alt={'loader'} className={'loader'} src={Loader} />
                        }
                        {loadingSessions === false &&
                        <Dropdown
                            class={'sessions'}
                            noOfCategories={categoriesInFilter.length}
                            activeItem={activeSession.session}
                            onActiveClick={() => assignSession({
                                session: activeSession.session,
                                dropdownOpen: activeSession.dropdownOpen !== true
                            })}
                            listItems={sessionsInFilter}
                            isOpen={activeSession.dropdownOpen}
                        />
                        }
                    </div>
                }
                <Dropdown
                    class = {'type'}
                    noOfCategories={categoriesInFilter.length}
                    activeItem={activeType.type}
                    onActiveClick = {() => assignType({type:activeType.type, dropdownOpen: activeType.dropdownOpen !== true})}
                    listItems = {[<div onClick={() => typeClick('Total standings')}>Total standings</div>, <div onClick={() => typeClick('Session')}>Session</div>]}
                    isOpen={activeType.dropdownOpen}
                />
            </div>
            <Fade in={error.status}>
                <div className={error.status ? 'error-msg active' : 'error-msg'}>
                    <div className={'error-msg__title'}><i className="fas fa-exclamation-triangle"></i>There's no data for the {activeRace.raceName}!</div>
                    <div>This is most likely because the {activeRace.raceName} has no completed sessions yet, or it could be
                        a temporary issue with getting the race data.
                    </div>
                    <div className={'error-msg__later'}>Please change race or try again later.</div>
                </div>
            </Fade>
            {!error.status &&
                <button onClick={buttonClick} disabled={button.disabled} className={button.loading === true ? 'loading' : ''}>
                    <img alt={'loader'} className={'loader'} src={Loader} />
                    <span>Go</span>
                </button>
            }
            <Fade in={categoriesInFilter.length > 0 && activeType.type === loadedSessionInfo.type}>
                <div className={'loaded-view-info'}>
                    <Fade in={button.loading}>
                        <div className={'loaded-view-info__blur'}></div>
                    </Fade>
                    <div className={'loaded-view-info__text'}>{loadedSessionInfo.text}</div>
                    {activeType.type === 'Session' &&
                        <div className={'loaded-view-info__columns'}>
                            <div className={'loaded-view-info__columns__column'}>
                                <div className={'loaded-view-info__columns__column__title'}>Track conditions</div>
                                {activeType.type === 'Session' &&
                                    <Weather
                                        type={activeSessionData.track}
                                        degrees={activeSessionData.air}
                                    />
                                }
                            </div>
                            <div className={'loaded-view-info__columns__column'}>
                                <div className={'loaded-view-info__columns__column__title'}>Session best lap</div>
                                <div>{activeSessionData.sessionBestLapRider}</div>
                                <div>{activeSessionData.sessionBestLapTime}</div>
                                <div>{activeSessionData.sessionBestLapSpeed}</div>
                                <div>Lap: {activeSessionData.sessionBestLapLap}</div>
                            </div>
                            <div className={'loaded-view-info__columns__column'}>
                                <div className={'loaded-view-info__columns__column__title'}>Best race lap of all time</div>
                                <div>{activeSessionData.raceLapRecordRider}</div>
                                <div>{activeSessionData.raceLapRecordLapTime}</div>
                                <div>{activeSessionData.raceLapRecordSpeed}</div>
                                <div>Year: {activeSessionData.raceLapRecordYear}</div>
                            </div>
                            <div className={'loaded-view-info__columns__column'}>
                                <div className={'loaded-view-info__columns__column__title'}>Best lap of all time</div>
                                <div>{activeSessionData.lapRecordRider}</div>
                                <div>{activeSessionData.lapRecordLapTime}</div>
                                <div>{activeSessionData.lapRecordSpeed}</div>
                                <div>Year: {activeSessionData.lapRecordYear}</div>
                            </div>
                        </div>
                    }
                    <Fade in={filtersChanged.changed}>
                        <div className={'filters-changed-notice'}><i className="fas fa-exclamation-circle"></i>Filters changed</div>
                    </Fade>
                </div>
            </Fade>
            {loadedSessionInfo.type === 'Total standings' && activeType.type === 'Total standings' && !error.status &&
                <table>
                    <Fade in={button.loading}>
                        <div className={'loaded-view-info__blur'}></div>
                    </Fade>
                    <thead dangerouslySetInnerHTML={{__html: tableHeader}}>
                    </thead>
                    <tbody dangerouslySetInnerHTML={{__html: resultsTable}}></tbody>
                </table>
            }
            {loadedSessionInfo.type === 'Session' && activeType.type === 'Session' && !error.status &&
                <table>
                    <Fade in={button.loading}>
                        <div className={'loaded-view-info__blur'}></div>
                    </Fade>
                    <thead dangerouslySetInnerHTML={{__html: sessionTableHeader}}>
                    </thead>
                    <tbody dangerouslySetInnerHTML={{__html: sessionTable}}></tbody>
                </table>
            }
        </div>
    </div>
}

export default Results;