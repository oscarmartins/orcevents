const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4600
const routes = require('./server/routes/routes')

app.use(express.static(path.join(__dirname, 'dist/orcman')))

app.use('/routes', routes)

app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'dist/orcman/index.html'))
})

app.listen(port, (req, res) => {
       console.log(`running on port ${port}`)
}); 