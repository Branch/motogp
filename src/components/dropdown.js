import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'

const Dropdown = (props) => {
    if(props.noOfCategories === undefined || props.noOfCategories > 0) {
        return (
            <div className={'dropdown__container'}>
                <div onClick={props.onActiveClick} className={'dropdown__container__active'}>
                    <span>{props.activeItem}<FontAwesomeIcon icon={faSortDown} /></span></div>
                <div className={`dropdown__container__${props.class} ${props.isOpen === true ? 'open' : ''}`}>
                    {props.listItems}
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default Dropdown;