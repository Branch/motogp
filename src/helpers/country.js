function CountryTranslate(val) {
    let country = '';

    if(val === 'SPA') {
        country = 'es';
    } else if(val === 'POR') {
        country = 'pt';
    } else if(val === 'FRA') {
        country = 'fr';
    } else if(val === 'ITA') {
        country = 'it';
    } else if(val === 'RSA') {
        country = 'za';
    } else if(val === 'JPN') {
        country = 'jp';
    } else if(val === 'AUS') {
        country = 'au';
    } else if(val === 'GER') {
        country = 'de';
    } else if(val === 'GBR') {
        country = 'gb';
    } else if(val === 'POR') {
        country = 'pt';
    } else if(val === 'USA') {
        country = 'us';
    } else if(val === 'NED') {
        country = 'nl';
    } else if(val === 'POR') {
        country = 'pt';
    } else if(val === 'SWI') {
        country = 'ch';
    } else if(val === 'THA') {
        country = 'th';
    } else if(val === 'MAL') {
        country = 'my';
    } else if(val === 'ARG') {
        country = 'ar';
    } else if(val === 'CZE') {
        country = 'cz';
    } else if(val === 'AUT') {
        country = 'au';
    } else if(val === 'TUR') {
        country = 'tr';
    } else if(val === 'INA') {
        country = 'id';
    } else if(val === 'COL') {
        country = 'cl';
    } else if(val === 'FIN') {
        country = 'fi';
    } else if(val === 'BEL') {
        country = 'be';
    }

    return country;
}

export default CountryTranslate;