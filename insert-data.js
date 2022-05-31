
const { default: axios } = require("axios")

const insertData = async (imdb_id, p1, pb1, pb2, title, movie_description, movie_image_link, movie_category, movie_ratings, movie_country, movie_year, movie_sub, eng_title)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(p1 == '' || pb1 == '' || pb2 == '' || title == '' || movie_description == '' || movie_image_link == '' || movie_category == '' || movie_country == '' || movie_year == ''){
                resolve('incomplete parameters to upload to ziuir process..failed')
            }else{
                let rq = await axios({
                    method: "post",
                    url:"https://ziuri.xyz/grabber/upload-movie",
                    data: { imdb_id: imdb_id, p1 : p1, pb1 : pb1, pb2 : pb2, title : title, movie_description : movie_description, movie_image_link : movie_image_link, movie_category : movie_category, movie_ratings: movie_ratings, movie_country: movie_country, movie_year : movie_year, movie_sub: movie_sub , eng_title: eng_title },
                    headers: { "Content-Type": "application/json" },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                })

                let response = rq.data.resp
                resolve(response)
            }

        } catch (error) { 
            resolve(error)
        }
    })
}

const insertSerieData = async (imdb_id, p1, pb1, pb2, title, episode, serie_description, serie_image_link, serie_category, serie_ratings, serie_country, serie_year, serie_sub, eng_title)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(p1 == '' || pb1 == '' || pb2 == '' || title == '' || serie_description == '' || serie_image_link == '' || serie_category == '' || serie_country == '' || serie_year == ''){
                resolve('incomplete parameters to upload to ziuir process..failed')
            }else{
                let rq = await axios({
                    method: "post",
                    url:"https://ziuri.xyz/grabber/upload-serie",
                    data: { imdb_id: imdb_id,  p1 : p1, pb1 : pb1, pb2 : pb2, title : title, episode: episode , serie_description : serie_description, serie_image_link : serie_image_link, serie_category : serie_category, serie_ratings: serie_ratings, serie_country: serie_country, serie_year : serie_year, serie_sub: serie_sub, eng_title: eng_title },
                    headers: { "Content-Type": "application/json" }
                })

                let response = rq.data.resp
                resolve(response)
            }

        } catch (error) { 
            resolve('error uploading content from grabber: proccess..failed')
        }
    })
}

const checkIsNotDuplicate = async (title)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            if(title == '' || title == undefined){
                resolve(false)

            }else{
                let rq = await axios({
                    method: "post",
                    url:"https://ziuri.xyz/grabber/check-movie-exist",
                    data: { title : title },
                    headers: { "Content-Type": "application/json" }
                }).catch((e)=> console.log('err checking with axios'))

                let response = rq.data.resp
                resolve(response)
            }
        } catch (error) {
            
        }
    })
}

const checkSerieIsNotDuplicate =  async (title, episode)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            if(title == '' || title == undefined){
                resolve(false)

            }else{
                let rq = await axios({
                    method: "post",
                    url:"https://ziuri.xyz/grabber/check-serie-exist",
                    data: { title : title, episode: episode },
                    headers: { "Content-Type": "application/json" }
                }).catch((e)=> console.log('err checking with axios'))

                let response = rq.data.resp
                resolve(response)
            }
        } catch (error) {
            
        }
    })
}

module.exports = { insertData, checkIsNotDuplicate, checkSerieIsNotDuplicate, insertSerieData }
