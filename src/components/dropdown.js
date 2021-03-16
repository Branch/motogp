import React from 'react'

const Dropdown = (props) => {
    return (
        <div className="dropdown" onClick={props.onDropdownClick}>
            {props.listItems}
        </div>
    )
}

export default Dropdown;