import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'

const Dropdown = (props) => {
    return (
        <div className={'dropdown__container'}>
            <div onClick={props.onActiveClick} className={'dropdown__container__active'}>
                <FontAwesomeIcon icon={faSortDown} />
                {props.activeItem}</div>
            <div className={`dropdown__container__${props.class} ${props.isOpen === true ? 'open' : ''}`}>
                {props.listItems}
            </div>
        </div>
    )
}

export default Dropdown;