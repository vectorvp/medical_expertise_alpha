const express = require('express') 
const http = require('http');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const path = require('path')
const fileupload = require('express-fileupload')
const request = require('request')
const bodyParser = require('body-parser')
const cors = require('cors')
//routes
const homeRoutes = require('./routes/homeRoutes')
const docRoutes = require('./routes/docRoutes')
const userRoutes = require('./routes/userRoutes')
const monitoringRoutes = require('./routes/monitoringRoutes')
const qualityRoutes = require('./routes/qualityRoutes')
dotenv.config()

connectDB() 

const app = express()
const server = http.createServer(app);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
})

app.use(cors())
app.use(fileupload({}))
app.use(express.json()) 
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users', userRoutes) 
app.use('/api/home', homeRoutes) 
app.use('/api/doctors', docRoutes) 
app.use('/api/monitoring', monitoringRoutes)
app.use('/api/qualityControl', qualityRoutes)  


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}

const ws = require('ws')

const PORT = process.env.PORT || 5000
server.listen(PORT, console.log(colors.green(`Serever run on port ${PORT}`)))

