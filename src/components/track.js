import React from 'react'
import lemans from '../assets/images/tracks/le-mans.svg';
import chang from '../assets/images/tracks/chang.svg';
import ricardo from '../assets/images/tracks/ricardo-tormo.svg';
import redbull from '../assets/images/tracks/redbullring.svg';
import mugello from '../assets/images/tracks/mugello.svg';
import silverstone from '../assets/images/tracks/silverstone.svg';
import motegi from '../assets/images/tracks/motegi.svg';
import catalunya from '../assets/images/tracks/catalunya.svg';
import assen from '../assets/images/tracks/assen.svg';
import saxen from '../assets/images/tracks/sachsenring.svg';
import misano from '../assets/images/tracks/misano.svg';
import aragon from '../assets/images/tracks/aragon.svg';
import argentina from '../assets/images/tracks/argentina.svg';
import cota from '../assets/images/tracks/cota.svg';
import jerez from '../assets/images/tracks/jerez.svg';
import pa from '../assets/images/tracks/philip-island.svg';
import qatar from '../assets/images/tracks/qatar.svg';
import sepang from '../assets/images/tracks/sepang.svg';

const Track = (props) => {
    if(props.track === 'FRA') {
        return <img className={'medium shadow'} src={lemans} />;
    } else if(props.track === 'ITA') {
        return <img className={'medium shadow'} src={mugello} />;
    } else if(props.track === 'QAT' || props.track === 'DOH') {
        return <img className={'medium shadow'} src={qatar} />;
    } else if(props.track === 'SPA') {
        return <img src={jerez} />;
    } else if(props.track === 'CAT') {
        return <img className={'large'} src={catalunya} />;
    } else if(props.track === 'GER') {
        return <img className={'large shadow'} src={saxen} />;
    } else if(props.track === 'NED') {
        return <img className={'medium'} src={assen} />;
    } else if(props.track === 'STY' || props.track === 'AUT') {
        return <img className={'large shadow'} src={redbull} />;
    } else if(props.track === 'GBR') {
        return <img src={silverstone} />;
    } else if(props.track === 'ARA') {
        return <img className={'medium shadow'} src={aragon} />;
    } else if(props.track === 'RSM') {
        return <img className={'large shadow'} src={misano} />;
    } else if(props.track === 'JPN') {
        return <img className={'medium shadow'} src={motegi} />;
    } else if(props.track === 'THA') {
        return <img className={'large'} src={chang} />;
    } else if(props.track === 'AUS') {
        return <img className={'large shadow'} src={pa} />;
    } else if(props.track === 'MAL') {
        return <img className={'medium shadow'} src={sepang} />;
    } else if(props.track === 'VAL') {
        return <img className={'large shadow'} src={ricardo} />;
    } else if(props.track === 'ARG') {
        return <img className={'medium shadow'} src={argentina} />;
    } else if(props.track === 'AME') {
        return <img className={'medium shadow'} src={cota} />;
    }
    return null;
}

export default Track;