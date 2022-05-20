const { default: axios } = require("axios")

const upload_streamtape_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            let upload = await streamtape_remote_upload(link).catch((e)=> console.log('err st 8'))
            let video_link = await streamtape_get_video_id(upload).catch((e)=> console.log('err st 9'))
            resolve(video_link)
        } catch (error) {
            resolve('error uploaing')
       }
   })
}

const streamtape_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let login = '01754716cdc86092533a'
            let key = 'OxpMZyjympIZMmK'
            let resp = await  axios.get(`https://api.streamtape.com/remotedl/add?login=${login}&key=${key}&url=${link}`).catch((err) => console.log('error request to streamtp'))
            if(resp.data){
                if(resp.data.result.n){
                    let id = resp.data.result.n
                }
            }
            resolve(id)
        } catch (error) {
            resolve('error uploaing')
        }
   })
}

const streamtape_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
       try {
            var intv = setInterval(async () => {
                let login = '01754716cdc86092533a'
                let key = 'OxpMZyjympIZMmK'
                let rq = await  axios.get(`https://api.streamtape.com/remotedl/status?login=${login}&key=${key}&id=${id}`).catch((err) => console.log('error request to streamtp')) 
                if(rq.data.result){
                    let raw = rq.data.result
                    for (var i in raw){
                        let linkId = raw[i].linkid
                        if(linkId != false){
                            clearInterval(intv)
                            let video_link = 'https://streamtape.com/e/' + linkId
                            resolve(video_link)
                        }
                    }
                }
           }, 30000);
       } catch (error) {
        resolve('error uploaing')
       }
   })
}

module.exports = { upload_streamtape_server }