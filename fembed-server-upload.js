const { default: axios } = require("axios")

const upload_fembed_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            let upload = await fembed_remote_upload(link) 
            // let video_link = await fembed_get_video_id(upload)
            resolve(upload)
        } catch (error) {
            throw error
       }
   })
}

const fembed_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let client = process.env.FEMBED_CLIENT
            let key = process.env.FEMBED_API_KEY
            let arr = [`${link}`]
            let nlink = JSON.stringify(arr)
            console.log(nlink)
            let resp = axios({
                method: "post",
                url:"https://www.fembed.com/api/transfer",
                data: `client_id=${client}&client_secret=${key}&links=${link}`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
             })
            console.log(resp)
            resolve(id)
        } catch (error) {
            throw error
        }
   })
}

const fembed_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
       try {
            var intv = setInterval(async () => {
                let login = process.env.fembed_API_LOGIN
                let key = process.env.fembed_API_KEY
                let rq = await  axios.get(`https://api.fembed.com/remotedl/status?login=${login}&key=${key}&id=${id}`);  
                let raw = rq.data.result
                for (var i in raw){
                    let linkId = raw[i].linkid
                    if(linkId != false){
                        clearInterval(intv)
                        let video_link = 'https://fembed.com/e/' + linkId
                        resolve(video_link)
                    }
                }
           }, 30000);
       } catch (error) {
           throw error
       }
   })
}

module.exports = { upload_fembed_server }