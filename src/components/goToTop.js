import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleUp} from '@fortawesome/free-solid-svg-icons'

const goToTop = (props) => {

    return (
        <div className={props.show ? 'to-top active' : 'to-top'} onClick={props.onClick}>
            <FontAwesomeIcon icon={faAngleUp} />
        </div>
    )
}

export default goToTop;