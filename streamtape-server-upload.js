const { default: axios } = require("axios")

const upload_streamtape_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            var upload, video_link
            if(link == '' || link == undefined){
                console.log('empty video link passed to streamtape server')
                resolve(false)
            }else{
                upload = await streamtape_remote_upload(link).catch((e)=> console.log('err st 8'))
                if(upload == false){
                    console.log('could not upload streamtape server')
                    resolve(false)
                }else{
                    video_link = await streamtape_get_video_id(upload).catch((e)=> console.log('err st 9'))
                    if(video_link == false){
                        console.log('could not get uploaded video to streamtape server link')
                        resolve(false)
                    }
                }
            }
        } catch (error) {
            resolve(false)
       }
   })
}

const streamtape_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let login = '01754716cdc86092533a'
            let key = 'OxpMZyjympIZMmK'
            let resp = await  axios.get(`https://api.streamtape.com/remotedl/add?login=${login}&key=${key}&url=${link}`).catch((err) => console.log('error request to streamtp'))
            var id = false
            if(resp.data){
                if(resp.data.result.id){
                    id = resp.data.result.id
                    resolve(id)
                }else resolve(id)
            }else resolve(id)
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
           }, 10000);
       } catch (error) {
        resolve('error uploaing')
       }
   })
}

module.exports = { upload_streamtape_server }