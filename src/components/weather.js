import React from 'react'
import Sun from '../assets/images/sun.svg';
import Rain from '../assets/images/rain.svg';

const Weather = (props) => {
    if(props.type === 'Dry') {
        return (
            <img src={Sun} />
        )
    } else if(props.type === 'Wet') {
        return (
            <img src={Rain} />
        )
    }
    return null;
}

export default Weather;