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
        videoRecorderBtn.classList.add("record-animation");

    }
    else{
        recordState=false;
        mediaRecorder.stop();
        videoRecorderBtn.classList.remove("record-animation");
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
    //creating  a canvas equal to the video height and with
    let canvas=document.createElement("canvas");
    canvas.width=videoPlayer.videoWidth;
    canvas.height=videoPlayer.videoHeight;
    let tool=canvas.getContext("2d");
    //drawing image on that canvas
    tool.drawImage(videoPlayer,0,0);
    //to convert canvas to url use .toDataURL
    let link=canvas.toDataURL();
    //download 
    let anchor=document.createElement("a");
    anchor.href=link;
    anchor.download="file.png";
    anchor.click();
    anchor.remove();
})