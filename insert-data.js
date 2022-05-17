
const { default: axios } = require("axios")

const insertData = async (imdb_id, p1, pb1, pb2, title, movie_description, movie_image_link, movie_category, movie_ratings, movie_country, movie_year, movie_sub)=>{
    return new Promise(async (resolve, reject) => {
        try {
            if(p1 == '' || pb1 == '' || pb2 == '' || title == '' || movie_description == '' || movie_image_link == '' || movie_category == '' || movie_country == '' || movie_year == ''){
                resolve('incomplete parameters to upload to ziuir process..failed')
            }else{
                let rq = await axios({
                    method: "post",
                    url:"https://ziuri.xyz/grabber/upload-movie",
                    data: { imdb_id: imdb_id, p1 : p1, pb1 : pb1, pb2 : pb2, title : title, movie_description : movie_description, movie_image_link : movie_image_link, movie_category : movie_category, movie_ratings: movie_ratings, movie_country: movie_country, movie_year : movie_year, movie_sub: movie_sub },
                    headers: { "Content-Type": "application/json" }
                })

                let response = rq.data.resp
                resolve(response)
            }

        } catch (error) { 
            resolve('error checking if content exist: proccess..failed')
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

module.exports = { insertData, checkIsNotDuplicate }