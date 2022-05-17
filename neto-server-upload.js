const { default: axios } = require("axios")

const upload_neto_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            let upload = await neto_remote_upload(link).catch((e)=> console.log('err neto 7'))
            let video_id = await neto_get_video_id(upload).catch((e)=> console.log('err neto 8'))
            let embed_link = await neto_get_embed(video_id).catch((e)=> console.log('err neto 9'))
            resolve(embed_link)
        } catch (error) {
            resolve('neto upload error')
       }
   })
}

const neto_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let key = 'da4b99461a0fc9bf0948baddbeb54221'
            let rq = await  axios.get(`https://netu.tv/api/file/remotedl?key=${key}&url=${link}`).catch((err) => console.log('error request to netu'))
            let raw = rq.data.result.id
            for (var i in raw){
                resolve(i)
            }
        } catch (error) {
            resolve('neto upload error')
        }
   })
}

const neto_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
       try {
            var intv = setInterval(async () => {
                let key = 'da4b99461a0fc9bf0948baddbeb54221'
                let rq = await  axios.get(`https://netu.tv/api/file/status_remotedl?key=${key}&id=${id}`).catch((err) => console.log('error request to neto'))
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
        resolve('neto upload error')
       }
   })
}

const neto_get_embed  = async (video_id)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let key = 'da4b99461a0fc9bf0948baddbeb54221'
            let rq = await  axios.get(`https://netu.tv/api/file/embed?key=${key}&file_code=${video_id}`).catch((err) => console.log('error request to netu'))
            let raw = rq.data.result
            for (var i in raw){
                let embed_link = raw[i].embed_link
                resolve(embed_link)
            }
        } catch (error) {
            resolve('neto upload error')
        }
    })
}

module.exports = { upload_neto_server }