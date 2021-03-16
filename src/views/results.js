import React, {useEffect, useState} from 'react';
import Dropdown from '../components/dropdown';

function Results(props) {

    const [yearsInFilter, assignYears] = useState([])
    const [resultsTable, setResultsTable] = useState([])

    const setYears = async () => {
        let years = [];

        for(let i = new Date().getFullYear(); i >= 2015; i--) {
            years.push(i)
        }
        let elements = years.map((year) =>
            <div>{year}</div>
        )

        assignYears(elements)
    }

    // Create async function for fetching users list
    const fetchResults = async () => {
        fetch('/motogp/standings/rider')
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
                setResultsTable(newResultsTable)

            })
    }



    // Use useEffect to call fetchMessage() on initial render
    useEffect(() => {
        setYears()
        fetchResults()
    }, [])





    return <div className={'index-main-results'} ref={props.ref}>
        <div className={'index-main-results-inner container'}>
            <h2>
            <Dropdown
                onDropdownClick = {() => {console.log('test')}}
                listItems = {yearsInFilter}
            />
            results</h2>
            <div className={'index-main-results-inner__filters'}>
                <div className={'index-main-results-inner__filters__filter active'}>Rider standings</div>
                <div className={'index-main-results-inner__filters__filter'}>Mugello race results</div>
            </div>
            <button>Go</button>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Rider</th>
                        <th>Team</th>
                        <th>Nationality</th>
                        <th>Points</th>
                        <th>Diff to #1</th>
                        <th>Diff to rider ahead</th>
                    </tr>
                </thead>
                <tbody dangerouslySetInnerHTML={{__html: resultsTable}}></tbody>
            </table>
        </div>
    </div>
}

export default Results;