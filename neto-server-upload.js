const { default: axios } = require("axios")

const upload_neto_server = (link) => {
   return new Promise(async (resolve, reject) => {
        try {
            var is_responeded = false
             setTimeout(() => {
                 if(is_responeded == false){
                      resolve(false)
                 }
            }, 180000);
            var upload, video_id, embed_link
            if(link == '' || link == undefined){
                console.log('empty link passed to neto server')
                resolve(false)
            }else{
                upload = await neto_remote_upload(link) 
                if(upload == false){
                    console.log('uploading return false response')
                    resolve(false)
                }else{
                    video_id = await neto_get_video_id(upload)
                    if(video_id == false){
                        console.log('unable to get video id of uploaded video to neto')
                        resolve(false)
                    }else{
                        let del = await delete_upload_from_queue(upload)
                        console.log(del)
                        is_responeded = true
                        resolve(video_id)
                        // embed_link = await neto_get_embed(video_id)
                        // if(embed_link == false){
                        //     console.log('unable to get video embed link of neto')
                        //     resolve(false)
                        // }else{
                        //     delete_upload_from_queue(upload)
                        //     resolve(embed_link)
                        // }
                    }
                }
            }
        } catch (error) {
            console.log('catch error during upload to neto process 1')
            resolve(false)
       }
   })
}

const neto_remote_upload = async (link) =>{
   return new Promise(async (resolve, reject) => {
        try {
            let key = 'da4b99461a0fc9bf0948baddbeb54221'
            let rq = await  axios.get(`https://netu.tv/api/file/remotedl?key=${key}&url=${link}`).catch((err) => console.log('error request to netu'))
            try {
                if(rq.data.result.id){
                    let raw = rq.data.result.id
                    for (var i in raw){
                        resolve(i)
                    }
                }
            } catch (error) {
                console.log(rq.data)
                resolve(false)
            }
        } catch (error) {
            console.log('catch error during upload to neto process 2')
            resolve(false)
        }
   })
}

const delete_upload_from_queue = async (upload_id)=>{
    
    let key = 'da4b99461a0fc9bf0948baddbeb54221'
    let rq = await  axios.get(`https://netu.tv/api/file/delete_remotedl?key=da4b99461a0fc9bf0948baddbeb54221&id=${upload_id}`).catch((err) => console.log('error request to netu'))
    return rq.data
}

const neto_get_video_id = async(id)=>{
   return new Promise(async (resolve, reject) => {
       try {
         
            var intv = setInterval(async () => {
                let key = 'da4b99461a0fc9bf0948baddbeb54221'
                let rq = await  axios.get(`https://netu.tv/api/file/status_remotedl?key=${key}&id=${id}`).catch((err) => console.log('error request to neto'))
                try {
                    if(rq.data.result.files){
                        let raw = rq.data.result.files
                        for (var i in raw){
                            if(raw[i].file_code){
                                clearInterval(intv)
                                let file_code = raw[i].file_code
                                resolve(file_code)
                            }
                        }
                    }else{
                        console.log('awaiting to get uploaded video to neto file code retrying..')
                    }
                } catch (error) {
                    resolve(false)
                    console.log('upload script err')
                }
            }, 5000);
       } catch (error) {
            console.log('catch error during upload to neto process 3')
            resolve(false)
       }
   })
}

// const neto_get_embed  = async (video_id)=>{
//     return new Promise(async (resolve, reject) => {
//         try {
//             let key = 'da4b99461a0fc9bf0948baddbeb54221'
//             let rq = await  axios.get(`https://netu.tv/api/file/embed?key=${key}&file_code=${video_id}`).catch((err) => console.log('error request to netu'))
//             try {
//                 if(rq.data.result){
//                     let raw = rq.data.result
//                     for (var i in raw){
//                         let embed_link = raw[i].embed_link
//                         resolve(embed_link)
//                     }
//                 }
//             } catch (error) {
//                 resolve(false)
//             }
//         } catch (error) {
//             console.log('catch error during upload to neto process 4')
//             resolve(false)
//         }
//     })
// }

module.exports = { upload_neto_server }