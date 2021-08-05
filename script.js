let videoPlayer=document.querySelector("video");
let videoRecorderBtn=document.querySelector("#record-video");
let recordState=false;
let contraints={video:true,audio:true};
let mediaRecorder;
let chunks=[];
let captureBtn=document.querySelector("#capture-btn");
let clearObj;
let filterColor = "";
let zoomLevel=1;
let zoomInElem = document.querySelector("#plus-container");
let zoomOutElem = document.querySelector("#minus-container");
let uiFilter = document.querySelector(".ui-filter");
let allFilters = document.querySelectorAll(".filter");
let timingELem = document.querySelector("#timing");
videoRecorderBtn.addEventListener("click",function(){
    if(mediaRecorder!=undefined){
        if(recordState==false){
        recordState=true;
        
        mediaRecorder.start();
        videoRecorderBtn.classList.add("record-animation");
        startCounting();

    }
    else{
        recordState=false;
        mediaRecorder.stop();
        videoRecorderBtn.classList.remove("record-animation");
        stopCounting();
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
        //chunks=[];
        // let blobUrl=URL.createObjectURL(blob);
        addMediaToGallery(blob,'video');
        // let link=document.createElement('a');
        // link.href=blobUrl;
        // link.download='video.mp4';
        // link.click();
        // link.remove();
    }
}).catch(function(err){
    console.log(err);
})

captureBtn.addEventListener("click",function(){
    captureBtn.classList.add("capture-animation");
    //creating  a canvas equal to the video height and with
    let canvas=document.createElement("canvas");
    canvas.width=videoPlayer.videoWidth;
    canvas.height=videoPlayer.videoHeight;
    let tool=canvas.getContext("2d");
    tool.scale(zoomLevel, zoomLevel);
    let x = (canvas.width / zoomLevel - canvas.width) / 2;
    let y = (canvas.height / zoomLevel - canvas.height) / 2;
    tool.drawImage(videoPlayer, x, y);
    if (filterColor) {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    //to convert canvas to url use .toDataURL
    let link=canvas.toDataURL();
    addMediaToGallery(link,'img');
    //download 
    // let anchor=document.createElement("a");
    // anchor.href=link;
    // anchor.download="file.png";
    // anchor.click();
    // anchor.remove();
    setTimeout(function(){
        captureBtn.classList.remove("capture-animation");
    },1000);
})
function startCounting() {
    timingELem.classList.add("timing-active");
    let timeCount = 0;
    clearObj = setInterval(function () {
        let seconds = (timeCount % 60) < 10 ? `0${timeCount % 60}` : `${timeCount % 60}`;
        let minutes = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount / 60)}` : `${Number.parseInt(timeCount / 60)}`;
        let hours = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount / 3600)}` : `${Number.parseInt(timeCount / 3600)}`;
        timingELem.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    }, 1000);
}
function stopCounting() {
    timingELem.classList.remove("timing-active");
    timingELem.innerText = "00: 00: 00";
    clearInterval(clearObj);
}
// filter apply
for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", function () {
        // add filter to ui
        let color = allFilters[i].style.backgroundColor
        if (color) {
            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        } else {
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor = "";
            filterColor = "";

        }
    })
}
// zoom in zoom out
zoomInElem.addEventListener("click", function () {
    if (zoomLevel < 3) {
        zoomLevel += 0.2;
        videoPlayer.style.transform = `scale(${zoomLevel})`;
    }
})
zoomOutElem.addEventListener("click", function () {
    if (zoomLevel > 1) {
        zoomLevel -= 0.2;
        videoPlayer.style.transform = `scale(${zoomLevel})`;
    }
})
