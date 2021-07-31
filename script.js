let videoPlayer=document.querySelector("video");
let videoRecorderBtn=document.querySelector("#record-video");
let recordState=false;
let contraints={video:true,audio:true};
let mediaRecorder;
let chunks=[];
let captureBtn=document.querySelector("#capture-btn");
videoRecorderBtn.addEventListener("click",function(){
    if(mediaRecorder!=undefined){
        if(recordState==false){
        recordState=true;
        
        mediaRecorder.start();
        videoRecorderBtn.innerText='Recording...';
    }
    else{
        recordState=false;
        mediaRecorder.stop();
        videoRecorderBtn.innerText='Record';
    }
}
    
})
navigator.mediaDevices.getUserMedia(contraints).then(function(mediaStream){
    videoPlayer.srcObject=mediaStream;
    mediaRecorder=new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable=function(e){
        chunks.push(e.data);
    }
    mediaRecorder.onstop=function(){
        let blob=new Blob(chunks,{type:'video.mp4'});
        chunks=[];
        let blobUrl=URL.createObjectURL(blob);
        let link=document.createElement('a');
        link.href=blobUrl;
        link.download='video.mp4';
        link.click();
        link.remove();
    }
}).catch(function(err){
    console.log(err);
})
captureBtn.addEventListener("click",function(){
    let canvas=document.createElement("canvas");
    canvas.width=videoPlayer.videoWidth;
    canvas.height=videoPlayer.videoHeight;
    let tool=canvas.getContext("2d");
    //drawing image on that canvas
    tool.drawImage(videoPlayer,0,0);
    let link=canvas.toDataURL();
    let anchor=document.createElement("a");
    anchor.href=link;
    anchor.download="file.png";
    anchor.click();
})