import React from 'react'
import Sun from '../assets/images/sun.svg';
import Rain from '../assets/images/rain.svg';

const Weather = (props) => {
    if(props.type === 'Dry') {
        return (
            <div>
                <img alt={'sun'} src={Sun} />
                {props.degrees} C
            </div>
        )
    } else if(props.type === 'Wet') {
        return (
            <div>
                <img alt={'wet'} src={Rain} />
                {props.degrees} C
            </div>
        )
    }
    return null;
}

export default Weather;