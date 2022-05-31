
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { upload_neto_server } = require ('./neto-server-upload')
const { upload_streamsb_server } = require('./streamsb-server-upload')
const { insertData, checkIsNotDuplicate } = require('./insert-data')
const imdb = require('imdb-api')
puppeteer.use(StealthPlugin());
const env = require('dotenv')
env.config({ path: './.env'})

async function scrapPage(browser, viewport, url, resolve){
  var contentTitle
  var contentTitleEng
  var contentDescription
  var contentImage
  var contentLanguage
  var contentYear
  var contentRating
  var contentGenre
  var contentCountry
  var pb1
  var pb2
  var pb1
  var imdb_id
  var movLink 
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (contentCountryWindows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
  var cookie = [ // cookie exported by google chrome plugin editthiscookie
  {
    "domain": "filmux.info",
    "hostOnly": false,
    "httpOnly": true,
    "name": "PHPSESSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "ac5c1spa7qclfh3ri3lgv682u5",
    "id": 1
  }
] 
await page.setViewport(viewport);
await page.setCookie(...cookie)
await page.goto(url,{ waitUntil: 'networkidle2' });  
page.waitForNavigation({ waitUntil: 'networkidle0' })
var loadingTimout = 0
var intv = setInterval(async () => {
  loadingTimout ++ 
  var iframes = []
  
  let iframesCollector = await page.$eval('#dle-content', (el)=>{
    if(el != null || el != undefined) return { key : 'cool'}
  }).catch((e)=>{ console.log('clouldfare blcking scrapping could not detet content reconnecting..') })
  
  if(iframesCollector != undefined || iframesCollector != null) iframes = iframesCollector
  
  if(iframes.length != 0){
    clearInterval(intv)
    loadingTimout = 0
    console.log('Cloudfare DDoS protection successfully bypassed')
   
    contentTitle  = await page.evaluate(()=>{
      return  document.querySelector("#dle-content > div > div.short-top.fx-row > div.short-top-left.fx-1 > h1").textContent
    }).catch((e)=>{ console.log('cannot read title') })   
    
    contentTitleEng  = await page.evaluate(()=>{
      return  document.querySelector("#dle-content > div > div.short-top.fx-row > div.short-top-left.fx-1 > div").textContent
    }).catch((e)=>{ console.log('cannot read eng title') })    
    
    contentDescription = await page.evaluate(()=>{
      return  document.querySelector("#dle-content > div > div.mtext.full-text.video-box.clearfix").textContent
    }).catch((e)=>{ console.log('could not get description') })
    
    contentDescription = contentDescription.replace('"', '').replace("'", "")
  
    contentLanguage = await page.$$eval('.short-info', async (el)=>{
      let elem =  el.find(e => e.textContent.includes('Kalba'))
      let cn =  elem.textContent
      let cnArr =  cn.split(':')
      return cnArr[1]
  }).catch((e)=>{ console.log('could not get language') })
    
    contentYear = await page.$$eval('.short-info', async (el)=>{
      let elem =  el.find(e => e.textContent.includes('Metai'))
      let cn =  elem.textContent
      let cnArr =  cn.split(':')
      return cnArr[1]
    }).catch((e)=>{ console.log('could not get year') })
    
    contentGenre = await page.$$eval('.short-info', async (el)=>{
      let elem =  el.find(e => e.textContent.includes('Žanras'))
      let cn =  elem.textContent
      let cnArr =  cn.split(':')
      return cnArr[1]
    }).catch((e)=>{ console.log('could not get genre') })
    
    contentCountry = await page.$$eval('.short-info', async (el)=>{
      let elem =  el.find(e => e.textContent.includes('Šalis'))
      let cn =  elem.textContent
      let cnArr =  cn.split(':')
      return cnArr[1]
    }).catch((e)=>{ console.log('could not get genre') })
    
    contentRating = await page.$$eval('.short-info', async (el)=>{
      let elem =  el.find(e => e.textContent.includes('IMDB'))
      let cn =  elem.textContent
      let cnArr =  cn.split(':')
      return cnArr[1].replace('(balsų', '')
    }).catch((e)=>{ console.log('could not get genre') })
    
    let imgLink = await page.evaluate(async ()=>{
      let link = document.querySelector("#dle-content > div > div.mcols.fx-row > div.short-left.mleft.icon-l > div.short-img.img-wide > img").getAttribute('src') 
      return 'https://filmux.info' + link
    }).catch((e)=>{ console.log('could not get img') })
    
    if(contentTitle != '' || contentTitle != undefined || contentDescription != '' || contentDescription  != undefined  || contentGenre != ''  || contentGenre  != undefined || contentImage != '' || contentImage != undefined){
      const page2 = await browser.newPage();
      var imgPage = await page2.goto(imgLink, { waitUntil: 'networkidle2' })
      page2.waitForNavigation({ waitUntil: 'networkidle0' })
      
      var imgIntv = setInterval(async () => {
        var images = []
        loadingTimout ++
        let imagesCollector = await page2.$eval('img', (el)=>{
          return el.src
        }).catch((e)=>{ console.log('could not detet image') })
        
        
        if(imagesCollector != undefined || imagesCollector != null){
          imagesCollector =  imagesCollector.split('?')[0]
          console.log('successfully gotten right image')
          if(imagesCollector == imgLink){
            images = imagesCollector 
            if(images.length != 0 && imgPage != undefined){
              clearInterval(imgIntv)
              loadingTimout = 0
              console.log('waiting to buffer image...')
              
              let buffer = await imgPage.buffer();
              contentImage =  'data:image/png;base64,' + buffer.toString('base64')
              console.log('image buffered')
              
              movLink = await page.evaluate(async ()=>{
                var sc
                await $("script").each(function(){ 
                  var rw = $(this).html()
                  if(rw.includes('new Playerjs')){
                    let rwArr = rw.split("//")
                    let rwL = rwArr[1]
                    sc = rwL.replace('"});', "")
                  }
                })
                return sc
              }).catch((e)=>{ console.log('could not get page script') })
              
              movLink = encodeURIComponent('https://' + movLink)
              
              console.log('site datas scraped')
              console.log('getting imdb info')
              let rq =  await imdb.get({name: contentTitleEng}, {apiKey: process.env.IMDB_ID, timeout: 30000}).catch((e)=>{ console.log('IMDB data not found') })
              if(rq == undefined){
                imdb_id = 'not found'
              }else{
                console.log('successfully gotten imdb data')
                imdb_id = rq.imdbid
                contentRating = rq.rating
                contentYear = rq.year
                console.log('imdb data scrapped')
              }
              console.log('checking if file if movie is not duplicate')
              let check_is_not_dup = await checkIsNotDuplicate(contentTitle)
              if(check_is_not_dup){
                pb2 = 'NAN'
                console.log('uploading to server 1')
                pb1 = await upload_neto_server(movLink)
                if(pb1 == false){
                  console.log('upload process stopped could not upload to neto server')
                  resolve()
                }else{
                  console.log('server 1 uploaded')
                  console.log('uploading to server 3')
                  p1 = await upload_streamsb_server(movLink)
                  if(p1 == false){
                    console.log('upload process stopped could not upload to netu')
                    resolve()
                  }else{
                    console.log('server 3 uploaded')
                    console.log('uploading movie to ziuri')
                    const upload_movie = await  insertData(imdb_id, p1, pb1, pb2, contentTitle, contentDescription, contentImage, contentGenre, contentRating, contentCountry, contentYear, contentLanguage, contentTitleEng)
                    console.log(upload_movie)
                    resolve(upload_movie)
                  }
                }
              }else{
                resolve()
                console.log('dup content')
              } 
            }else{
              console.log('cloudfare blocking image page reconnecting or imgPage is undefined...')
              if(loadingTimout > 40){
                await page2.reload({ waitUntil: ["networkidle2"]})
                loadingTimout = 0
              }
            }
          }else{
            console.log('wrong imgage detected getting right one')
          }
        } 
        
      }, 2000);
    }else{
      console.log('upload process stopped could not get scrape data') 
      resolve()
    }
  }else{
    if(loadingTimout > 80){
      await page.reload({ waitUntil: ["networkidle2"]})
      loadingTimout = 0
    }
  }
}, 2000);
}

const startMovieCrawlerProcess = async(url, mainResolve)=>{
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const crawler = await browser.newPage();
  await crawler.setUserAgent('Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0')
  var cookie = [ // cookie exported by google chrome plugin editthiscookie
  {
    "domain": "filmux.info",
    "hostOnly": false,
    "httpOnly": true,
    "name": "PHPSESSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "ac5c1spa7qclfh3ri3lgv682u5",
    "id": 1
  }
]
const viewport = {
  width: 1920 + Math.floor(Math.random() * 100),
  height: 3000 + Math.floor(Math.random() * 100),
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: false,
}
await crawler.setViewport(viewport);
await crawler.setCookie(...cookie)
await crawler.goto(url, { waitUntil: 'networkidle2' })
crawler.waitForNavigation({ waitUntil: 'networkidle2' })

var loadingTimout = 0
let lintv = setInterval(()=> loadingTimout ++, 1000)

var movieLink = []
var intv = setInterval(async()=>{
  
  let pgLoadTest = await crawler.$$eval('a.short-img', (el)=>{
    return el.map(el => el.href);
  }).catch(er => console.log('error injecting scrap test probably a navigation going on: re injecting...'))
  
  if(pgLoadTest != undefined || pgLoadTest != null ) movieLink = pgLoadTest
  
  if(movieLink.length != 0){
    
    clearInterval(intv)
    clearInterval(lintv)
    console.log('Cloudfare DDoS protection successfully bypassed')
    for (let link of movieLink){
      let upload = await new Promise(async (resolve) =>{
        try {
          await scrapPage(browser, viewport, link, resolve)
        } catch (error) {
          resolve('script error in process')
        }
      })
    }
    await browser.close()
    mainResolve()
  }else{
    console.log('cloudfare blocking connection: reconnecting....', loadingTimout)
    if(loadingTimout > 150){
      await crawler.reload({ waitUntil: ["networkidle2"]})
      loadingTimout = 0
    }
  }
}, 2000)

}

const startMovieCrawler = async (num)=>{ 
    for(let count  =  num; count >= 1; count --){
         let scrapPg = await new Promise(async (mainResolve)=>{
          let url = `https://filmux.info/filmai/page/` + count
             startMovieCrawlerProcess(url, mainResolve)
         })
    }
}

module.exports = { startMovieCrawler }













