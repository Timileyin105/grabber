const { default: axios } = require("axios")

const upload_streamsb_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            let upload = await streamsb_remote_upload(link).catch((e)=> console.log('err sb 9'))
            let video_link = await streamsb_get_video_id(upload).catch((e)=> console.log('err sb 10'))
            resolve(video_link)
        } catch (error) {
            resolve('error uploaing')
       }
   })
}

const streamsb_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try { 
            let key = '35231rplyx919qndcmqgu'
            let resp = await  axios.get(`https://api.streamsb.com/api/upload/url?key=${key}&url=${link}`).catch((err) => console.log('error request to sb'))
            let id = resp.data.result.filecode 
            console.log(id)
            resolve(id)
        } catch (error) {
            resolve('error uploaing')
        }
   })
}

const streamsb_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
        try {
            var intv = setInterval(async () => {
                let key = '35231rplyx919qndcmqgu'
                let rq = await  axios.get(`https://api.streamsb.com/api/file/direct?key=${key}&file_code=${id}`).catch((err) => console.log('error request to sb'))  
                if(rq.data.result){
                    clearInterval(intv)
                    const video_link = rq.data.result.n.url
                    resolve(video_link )
                }
           }, 30000);
        } catch (error) {
            resolve('error uploaing')
       }
   })
}

module.exports = { upload_streamsb_server }