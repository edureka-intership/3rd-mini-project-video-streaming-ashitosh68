const { request } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

app.get('/',function(request,response){
    response.sendFile(__dirname + "/index.html" );
})

app.get('/video',function(request,response){
const range = request.headers.range;
if(!range){
    response.status(400).send("requires range header");;
}
const videoPath = "ChhotaBheem.mp4";
const videoSize = fs.statSync(videoPath).size;
// console.log(videoSize);
const chunck_size = 10**6       //1mb on client side
const start = Number(range.replace(/\D/g,""));  //convert string to number
const end = Math.min(start + chunck_size, videoSize - 1);
const contentLength = end-start +1;

const headers = {
    "content-Range" : `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges" : `bytes`,
    "content-Length" : contentLength,
    "content-Type" : "video/mp4"
}
response.writeHead(206,headers)                               //206 - partial data
const videoStream = fs.createReadStream(videoPath,{start,end});
videoStream.pipe(response)

})

app.listen(3000,function(){
    console.log(`server is running at ${port}`);
})