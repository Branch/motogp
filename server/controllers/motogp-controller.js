const fetch = require('node-fetch');

exports.getLatest = async (req, res) => {
    let latestPath = 'https://www.motogp.com/en/Results+Statistics/2020/POR/MotoGP/RAC/World+Standing';

    fetch(latestPath)
        .catch(err => res.send({status: 500, data: `Request to url ${latestPath} failed`}))
        .then(res => res.text())
        .then(body => res.send({status: 200, data: body}))
}