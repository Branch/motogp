import React, { useRef } from 'react'

// General scroll to element function

const ScrollTo = (props) => {

    return (
            <div className="center-con" onClick={props.onClick}>
                <div className="round">
                    <div id="cta">
                        <span className="arrow primera next "></span>
                        <span className="arrow segunda next "></span>
                    </div>
                </div>
        </div>
    )
}

export default ScrollTo;