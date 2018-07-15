<style>
 /* trick to have canvas over image */
 #imgStream {
  position: absolute;
  z-index: 1;
 }
 
 #canvasTracking {
  position: relative;
  z-index: 10;
 }
 
 #canvasTemp {
  display: none;
 }
</style>

<div>
 <img id='imgStream' width='640' height='480'>
 <canvas id='canvasTracking'></canvas>
</div>

<canvas id='canvasTemp' width='320' height='420'></canvas>

<script>
 /* Enable FaceDetector in Chrome:
    chrome://flags/#enable-experimental-web-platform-features
  */
 
 /* Let us assume jsmpeg has been setup fine already */
 var facedetector;
 var imgStream, imgTemp;
 var canvasTracking, canvasTemp;
 var ctxTracking, ctxTemp;
 var timerId;
 
 $(document).ready(function(){
  imgStream      = $('#imgStream');
  canvasTracking = $('#canvasTracking')[0];
  canvasTemp     = $('#canvasTemp')[0];
  ctxTracking    = canvasTracking.getContext('2d');
  ctxTemp        = canvasTemp.getContext('2d');
  
  imgTemp = new Image();
  imgTemp.width = 640 / 2; // assume we are using this
  imgTemp.height= 480 / 2;
  
  try {
     facedetector = new FaceDetector();
  } catch (error){
    console.log(error);
  }
  
  // when imgTemp loads, do the tracking
  imgTemp.onload = function(){
    if (!facedetector){
       console.log('FaceDetector not available. Check if flag is enabled: chrome://flags/#enable-experimental-web-platform-features');
       return;
    }
    
    // clear rects
    ctxTracking.clearRect(0,0,canvasTracking.width,canvasTracking.height);
    
    facedetector.detect(this)
    .then(function(faces){
     faces.forEach(function(face){
       var box = face.boundingBox;
       
       ctxTracking.beginPath();
       ctxTracking.lineWidth = 1;
       ctxTracking.strokeStyle = 'red';
       
       // this image is 320x240 so we need to double to match
       ctxTracking.strokeRect(box.x*2, box.y*2, box.width*2, box.height*2);
     });
    })
    .catch(function(error){
     console.log('FaceDetector',error);
    })
  }
  
  // when stream is updated, copy image scaled down to canvasTempctx
  imgStream.onload = function(){
    // copy to canvasTemp
    ctxTemp.drawImage(this, 0, 0, 320, 240);
    imgTemp.src = ctx.toDataUrl();
  }
  
  function copy(){
      if (timerId) window.clearInterval(timerId);
      
      // update the stream display
      imgStream.src = player1.canvas.toDataUrl();
      
      timerId = window.setInterval(copy, 1000);
  }
  
  
  copy();
 });
 
 
</script>
