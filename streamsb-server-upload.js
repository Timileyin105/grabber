const { default: axios } = require("axios")

const upload_streamsb_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            var upload, video_link
            if(link == '' || link == undefined){
                console.log('empty link to stream sb server upload')
                resolve(false)
            }else{
                upload = await streamsb_remote_upload(link) 
                if(upload == false){
                    console.log('could not upload to sb server')
                    resolve(false)
                }else{
                    video_link = await streamsb_get_video_id(upload)
                    if(video_link == false){
                        console.log('could not get uploaded video to sb server video link')
                        resolve(false)
                    }else{
                        resolve(video_link)
                    }
                }
            }
        } catch (error) {
            console.log('catch error during upload to streamsb process 1')
            resolve(false)
       }
   })
}

const streamsb_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try { 
            let key = process.env.STREAMSB_API_KEY
            let resp = await  axios.get(`https://api.streamsb.com/api/upload/url?key=${key}&url=${link}`).catch((err) => console.log('error request to streamsb'))
            if(resp.data.result.filecode){
                let id = resp.data.result.filecode 
                resolve(id)
            }else{
                console.log('could not get filecode of uploaded video to sb server')
                resolve(false)
            }
        } catch (error) {
            console.log('catch error during upload to streamsb process 2')
            resolve(false)
        }
   })
}

const streamsb_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
        try {
            var intv = setInterval(async () => {
                let key = process.env.STREAMSB_API_KEY
                let rq = await  axios.get(`https://api.streamsb.com/api/file/direct?key=${key}&file_code=${id}`).catch((err) => console.log('error request to streamsb'))
                if(rq.data.result.n.url){
                    clearInterval(intv)
                    let video_link = rq.data.result.n.url
                    resolve(video_link)
                }else console.log('awaiting to get uploaded video embed url to streamsb  retrying..')
           }, 5000);
        } catch (error) {
            console.log('catch error during upload to streamsb process 3')
            resolve(false)
       }
   })
}

module.exports = { upload_streamsb_server }