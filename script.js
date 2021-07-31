let videoPlayer=document.querySelector("video");
let videoRecorderBtn=document.querySelector("#record-video");
let recordState=false;
let contraints={video:true,audio:true};
let mediaRecorder;
let chunks=[];
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