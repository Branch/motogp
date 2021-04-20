import React from 'react'

const Loader = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(241, 242, 243); display: block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g>
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;180 50 50" keyTimes="0;1"></animateTransform>

                <ellipse cx="50" cy="50" rx="40" ry="0.1" fill="none" stroke="#f8b26a" stroke-width="6" transform="rotate(0 50 50)"></ellipse>
                <ellipse cx="50" cy="50" rx="40" ry="0.1" fill="none" stroke="#f8b26a" stroke-width="6" transform="rotate(45 50 50)"></ellipse>
                <ellipse cx="50" cy="50" rx="40" ry="0.1" fill="none" stroke="#f8b26a" stroke-width="6" transform="rotate(90 50 50)"></ellipse>
                <ellipse cx="50" cy="50" rx="40" ry="0.1" fill="none" stroke="#f8b26a" stroke-width="6" transform="rotate(135 50 50)"></ellipse>
            </g>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#404040" stroke-width="6"></circle>
            <circle cx="50" cy="50" r="20" fill="#f8b26a" stroke="#f8b26a" stroke-width="6"></circle>
        </svg>
    )
}

export default Loader;