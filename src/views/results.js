import React, {useEffect, useState} from 'react';
import Dropdown from '../components/dropdown';

function Results(props) {

    const [activeYear, assignYear] = useState({
        year: new Date().getFullYear(),
        dropdownOpen: false
    })
    const [activeRace, assignRace] = useState({
        race: null,
        dropdownOpen: false
    })
    const [yearsInFilter, assignYears] = useState([])
    const [racesInFilter, assignRaces] = useState([])
    const [resultsTable, setResultsTable] = useState([])
    const [tableHeader, setTableHeader] = useState([])
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

    const fetchRaces  = async (year, setDefault = false) => {
        fetch(`/motogp/races?` + new URLSearchParams({
            year: year ? year : new Date().getFullYear()
        }))
            .then(res => res.json()) // Process the incoming data
            .then(json => {
                let races = JSON.parse(json.data)

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
                    raceClick(firstRace)
                }

            })
    }

    const yearClick = async (year) => {
        assignYear({year:year, dropdownOpen: false})
        fetchRaces(year)
    }

    const raceClick = async (race) => {
        assignRace({race:race, dropdownOpen: false})
    }

    // Create async function for fetching users list
    const fetchResults = async () => {
        console.log(activeRace.race)
        fetch(`/motogp/standings/rider?` + new URLSearchParams({
                year: activeYear.year,
                race: activeRace.race
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



    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {
        setYears()
        fetchRaces(new Date().getFullYear(), true)
    }, [])





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
            results</h2>
            <div className={'index-main-results-inner__filters'}>
                <div className={'index-main-results-inner__filters__filter active'}>Rider standings</div>
                <div className={'index-main-results-inner__filters__filter'}>
                    <Dropdown
                        class = {'races'}
                        activeItem={activeRace.race}
                        onActiveClick = {() => assignRace({race:activeRace.race, dropdownOpen: activeRace.dropdownOpen !== true})}
                        listItems = {racesInFilter}
                        isOpen={activeRace.dropdownOpen}
                    />
                    race results</div>
            </div>
            <button onClick={fetchResults}>Go</button>
            <table>
                <thead dangerouslySetInnerHTML={{__html: tableHeader}}>
                </thead>
                <tbody dangerouslySetInnerHTML={{__html: resultsTable}}></tbody>
            </table>
        </div>
    </div>
}

export default Results;