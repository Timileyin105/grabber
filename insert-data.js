const { conn } = require ('./connection')

const insertData = async(imdb_id, p1, pb1, pb2, title, movie_description, movie_image_link, movie_category, movie_ratings, movie_country, movie_year, movie_sub)=>{
    return new Promise((resolve, reject) => {
        try {
            if(p1 == '' || pb1 == '' || pb2 == '' || title == '' || movie_description == '' || movie_image_link == '' || movie_category == '' || movie_ratings == '' || movie_country == '' || movie_year == '' || movie_sub == ''){
                resolve('incomplete params')
            }else{
                let =  sql  = `INSERT INTO movies (imdb_id, private_movie_link, public_movie_link, public_movie_link2, movie_title, movie_description, movie_image_link, type, movie_category, imdb_ratings, movie_country, movie_year, movie_subtitle) VALUES ('${imdb_id}','${p1}', '${pb1}', '${pb2}', '${title}', '${movie_description}', '${movie_image_link}', 'movie', '${movie_category}', '${movie_ratings}', '${movie_country}', '${movie_year}', '${movie_sub}')`
                conn.query(sql)
                resolve('done')
            }
        } catch (error) { 
            throw error
        }
    })
}

const checkIsNotDuplicate = (title)=>{
    return new Promise((resolve, reject)=>{
        try {
            if(title == '' || title == undefined){
                resolve(false)
            }else{
                let sql = `SELECT * FROM movies WHERE movie_title == ${movie_title}`
                conn.query(sql, (err, arr)=>{
                    if(err) resolve(false)
                    else if (arr.lentgh > 0 )  resolve(false)
                    else return resolve(true)
                })
            }
        } catch (error) {
            
        }
    })
}

module.exports = { insertData, checkIsNotDuplicate }