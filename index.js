const { startMovieCrawler } = require('./movie')
const { startSerieCrawler } = require('./serie')
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

app.get('/', (req, res) => res.send('Hello world'))

app.post('/movie-grabber', (req, res) =>{
    const url = req.body.link
    if(url != '' && url != undefined){
        startMovieCrawler(url)
        res.json({resp: 'successfully started crawler'})
    }else  res.json({resp: 'missing url param'})
})

app.post('/serie-grabber', (req, res) =>{
    const url = req.body.link
    if(url != '' && url != undefined){
        startSerieCrawler(url)
        res.json({resp: 'successfully started crawler'})
    }else res.json({resp: 'missing url param'})
})



app.listen(port, () => console.log(`ziuir app listening on port ${port}!`))