
const puppeteer = require('puppeteer');
const fs = require("fs/promises");
const path = require("path");
const { upload_neto_server } = require ('./neto-server-upload')
const { upload_streamtape_server } = require ('./streamtape-server-upload')
const { upload_streamsb_server } = require('./streamsb-server-upload')
const { insertData, checkIsNotDuplicate } = require('./insert-data')
const imdb = require('imdb-api')
const { googleTranslator } = require('translators');


async function scrapPage(url){
    var netuLink
    var youtubeLink
    var contentTitle
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
        
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url,{ waitUntil: 'networkidle2' });
    setTimeout(async() => {
        
        await page.screenshot({ path: 'screen.jpg', fullPage: true})

        console.log('page loaded')
        const iframes = await page.$$eval('iframe', (el)=>{
            return el.map(el => el.getAttribute('data-src'));
        }).catch((e)=>{ console.log(e) })
        console.log('iframe mapped')


        contentTitle  = await page.evaluate(()=>{
           return  document.querySelector(".page__header > h1").textContent
        }).catch((e)=>{ console.log(e) })

        contentRating  = await page.evaluate(()=>{
            return  document.querySelector("div.card__rating-ext.imdb").textContent
        }).catch((e)=>{ console.log(e) })
        console.log('iframe decription scraped')


        contentDescription = await page.evaluate(()=>{
            return  document.querySelector("div.page__text.full-text").textContent
        }).catch((e)=>{ console.log(e) })


        contentLanguage = await page.evaluate(()=>{
            return  document.querySelector("#dle-content > article > div.page__subcols.d-flex > div.page__subcol-main.flex-grow-1.d-flex.fd-column > ul > li:nth-child(2) > div.line-clamp > a").textContent
        }).catch((e)=>{ console.log(e) })
    

        let imgLink = await page.evaluate(async ()=>{
            let link = document.querySelector("div.pmovie__poster > img").getAttribute('src') 
            return 'https://45.142.214.18' + link
        }).catch((e)=>{ console.log(e) })

    
        contentYear = await page.evaluate(()=>{
            return  document.querySelector("#dle-content > article > div.page__subcols.d-flex > div.page__subcol-main.flex-grow-1.d-flex.fd-column > ul > li:nth-child(1) > div.line-clamp > a").textContent
        }).catch((e)=>{ console.log(e) })

    
        contentGenre = await page.evaluate(()=>{
            return  document.querySelector("#dle-content > article > div.page__subcols.d-flex > div.page__subcol-main.flex-grow-1.d-flex.fd-column > ul > li:nth-child(3) > div.line-clamp").textContent
        }).catch((e)=>{ console.log(e) })

    
        for (const videoLink of iframes){
            if(videoLink == null || undefined){
                continue
            }else{
                if (videoLink.includes("waaw.to")) {
                    netuLink = videoLink
                }else if(videoLink.includes("youtube.com")){
                    youtubeLink = videoLink
                }
            }
    
        }

        console.log('iframe datas scraped')
        let contentTitleEng = await googleTranslator(contentTitle, 'lt', 'en');
        let rq =  await imdb.get({name: contentTitleEng}, {apiKey: process.env.IMDB_ID, timeout: 30000}).catch((e)=>{ console.log('IMDB data not found') })
        if(rq == undefined){
             contentCountry = ''
             imdb_id = ''
             let imgPage = await page.goto(imgLink, { waitUntil: 'networkidle2' });
             let fileName = Math.floor(Math.random() * (900000 - 100000)) + 100000 + '' + Math.floor(Math.random() * (900000 - 100000)) + 100000 + '' +Math.floor(Math.random() * (900000 - 100000)) + 100000 + '.png'
             await fs.writeFile(path.join(__dirname + '/../App/assets/' + fileName), await imgPage.buffer())
             contentImage = 'https://ziuri.xyz/assets/' + fileName
        }else{
            contentCountry = rq.year
            imdb_id = rq.imdbid
            contentImage = rq.poster
            console.log('imdb data scrapped')
        }
         
        pb1 = await upload_neto_server(netuLink)
        console.log('server 1 uploaded')
        pb2 = await upload_streamtape_server(youtubeLink)
        console.log('server 2 uploaded')
        p1 = await upload_streamsb_server(pb2)
        console.log('server 3 uploaded')
        await browser.close();

        const check_is_not_dup = checkIsNotDuplicate(contentTitle)
        if(check_is_not_dup){
            const upload_movie = await  insertData(imdb_id, p1, pb1, pb2, contentTitle, contentDescription, contentImage, contentGenre, contentRating, contentCountry, contentYear, contentLanguage)
            console.log(upload_movie)
        }else console.log('dup content')
    }, 20000);
}

console.log('ok')

//   const startCrawller= async()=>{
//     const browser = await puppeteer.launch();
//     const crawler = await browser.newPage();
//     console.log('ok2')
//     await crawler.goto('https://45.142.214.18/filmai/',{ waitUntil: 'networkidle2' });
//     setTimeout(async () => {
//         const movieLink = await crawler.$$eval('a.card__img', (el)=>{
//             return el.map(el => el.href);
//         }) 
//         for (const link of movieLink){
//             scrapPage(link)
//         }h
//     }, 10000);
//   }

//   startCrawller()

// scrapPage('https://45.142.214.18/10254-greitoji-pagalba-online.html')

   










