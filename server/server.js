// Import express framework
const express = require('express')

// Import middleware
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const fetch = require('node-fetch');

// Import routes
const homeRouter = require('./routes/home-route')
const motogpRouter = require('./routes/motogp-route')

// Setup default port
const PORT = process.env.PORT || 4000

// Create express app
const app = express()

// Implement middleware
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    app.get('*', (req, res) => {
        res.sendFile('build/index.html', { root: __dirname })
    })
}
// Implement route for '/api' endpoint
app.use('/api', homeRouter)
app.use('/motogp', motogpRouter)

// Implement route for '/users' endpoint
// ! Note:
// '/users' will prefix all post routes
// with '/users' => '/all' will become '/users/all'

/*
app.use('/users', usersRouter)*/
// Implement route for errors
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


//app.use('/motogp', motogpRouter)


/*

app.get(`/results`, (req,res) => {
    let html = window.document.createElement('html');

    fetch('https://www.motogp.com/en/ajax/results/parse/2020/STY/MotoGP/FP2')
        .then(res => res.text())
        .then(data => {
            html.innerHTML = data;

            let tds = html.getElementsByTagName('td')

        });
    return {1:'hejsan'};
});*/


// Start express app
app.listen(PORT, function() {
    console.log(`Server is running on: ${PORT}`)
})
