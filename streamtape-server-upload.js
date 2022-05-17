const { default: axios } = require("axios")

const upload_streamtape_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            let upload = await streamtape_remote_upload(link) 
            let video_link = await streamtape_get_video_id(upload)
            resolve(video_link)
        } catch (error) {
            throw error
       }
   })
}

const streamtape_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let login = '01754716cdc86092533a'
            let key = 'OxpMZyjympIZMmK'
            let resp = await  axios.get(`https://api.streamtape.com/remotedl/add?login=${login}&key=${key}&url=${link}`);
            let id = resp.data
            resolve(id)
        } catch (error) {
            throw error
        }
   })
}

const streamtape_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
       try {
            var intv = setInterval(async () => {
                let login = '01754716cdc86092533a'
                let key = 'OxpMZyjympIZMmK'
                let rq = await  axios.get(`https://api.streamtape.com/remotedl/status?login=${login}&key=${key}&id=${id}`);  
                let raw = rq.data.result
                for (var i in raw){
                    let linkId = raw[i].linkid
                    if(linkId != false){
                        clearInterval(intv)
                        let video_link = 'https://streamtape.com/e/' + linkId
                        resolve(video_link)
                    }
                }
           }, 30000);
       } catch (error) {
           throw error
       }
   })
}

module.exports = { upload_streamtape_server }