const { default: axios } = require("axios")

const upload_neto_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            let upload = await neto_remote_upload(link) 
            let video_id = await neto_get_video_id(upload)
            let embed_link = await neto_get_embed(video_id)
            resolve(embed_link)
        } catch (error) {
            throw error
       }
   })
}

const neto_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let key = process.env.NETU_API_KEY
            let rq = await  axios.get(`https://netu.tv/api/file/remotedl?key=${key}&url=${link}`);
            let raw = rq.data.result.id
            for (var i in raw){
                resolve(i)
            }
        } catch (error) {
            throw error
        }
   })
}

const neto_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
       try {
            var intv = setInterval(async () => {
                let key = process.env.NETU_API_KEY
                let rq = await  axios.get(`https://netu.tv/api/file/status_remotedl?key=${key}&id=${id}`);  
                let raw = rq.data.result.files
                for (var i in raw){
                    if(raw[i].file_code){
                        clearInterval(intv)
                        let file_code = raw[i].file_code
                        resolve(file_code)
                    }
                }
            }, 5000);
       } catch (error) {
           throw error
       }
   })
}

const neto_get_embed  = async (video_id)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let key = process.env.NETU_API_KEY
            let rq = await  axios.get(`https://netu.tv/api/file/embed?key=${key}&file_code=${video_id}`);
            let raw = rq.data.result
            for (var i in raw){
                let embed_link = raw[i].embed_link
                resolve(embed_link)
            }
        } catch (error) {
            throw error
        }
    })
}

module.exports = { upload_neto_server }