import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'

const Sidebar = (props) => {
    return <div className={`sidebar ${props.active}`}>
        <button onClick={props.onClose}><FontAwesomeIcon icon={faTimes} /></button>
        <ul>
            <li onClick={props.startScroll}>Top</li>
            <li onClick={props.resultScroll}>Results</li>
            <li onClick={props.aboutScroll}>About</li>
        </ul>
    </div>
}

export default Sidebar;