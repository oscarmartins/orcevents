const express = require('express');
const path = require('path');
const app = express();

const posts = require('./server/routes/posts')

app.use(express.static(path.join(__dirname, 'dist/orcman')))

app.use('/posts', posts)

app.get('*', (req, res) => {

       res.sendFile(path.__dirname, 'dist/orcman/index.html')

})

app.listen(4600, (req, res) => {
       console.log('running');
}); 