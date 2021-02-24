import React, {useEffect, useState} from 'react';

const fetch = require('node-fetch');

function Api(endpoint) {
    return fetch(endpoint)
            .then(res => res.text())
            .then(data => {
                return data;
            });
}

export default Api;