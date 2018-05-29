const color = 'aqua';
const lineWidth = 2;

function toTuple({ y, x }) {
  return [y, x];
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment([ay, ax], [by, bx], color, scalew, scaleh, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scalew, ay * scaleh);
  ctx.lineTo(bx * scalew, by * scaleh);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(keypoints, minConfidence, ctx, scalew = 1, scaleh = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(toTuple(keypoints[0].position),
      toTuple(keypoints[1].position), color, scalew, scaleh, ctx);
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scalew = 1, scaleh = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    ctx.beginPath();
    ctx.arc(x * scalew, y * scaleh, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

const videoWidth = 500;
const videoHeight = 500;

function loadImage(imagePath) {
    image = new Image();
    image.src = imagePath;
    return image;
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic happens.
 * This function loops with a requestAnimationFrame method.
 */
async function detectPoseInRealTime(video, net) {
    //window.postMessage('Estimando pose');
    
    const flipHorizontal = true; // since images are being fed from a webcam
  
    // Scale an image down to a certain factor. Too large of an image will slow down
    // the GPU
    const imageScaleFactor = 0.5
    const outputStride = 16
  
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;
    
    const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
    //window.postMessage('Pose encontrada');
    poses.push(pose);
    minPoseConfidence = 0.1;
    minPartConfidence = 0.7;

    document.getElementById("overlay").style.display = "hidden";
    document.getElementById("overlay").style.opacity = "0";

    const canvas = document.getElementById('canvas_img');
    const ctx = canvas.getContext('2d');

    const proportion = video.width / video.height;

    canvas.width = window.innerWidth-15;
    canvas.height = image.height * proportion;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
            drawKeypoints(keypoints, minPartConfidence, ctx, canvas.width/videoWidth, canvas.height/videoHeight);
            drawSkeleton(keypoints, minPartConfidence, ctx, canvas.width/videoWidth, canvas.height/videoHeight);
        }
    });
    return poses;
  }

document.addEventListener("message", function(event) {
    //document.body.style.zoom = 1;
    document.getElementById("overlay").style.display = "visible";
    document.getElementById("overlay").style.opacity = "1";
    //image = document.getElementById("image")
    image = loadImage('data:image/jpeg;base64, '+event.data);
    //window.postMessage('Cargando modelo');
    posenet.load(1.01).then(function(net){
        //window.postMessage('Modelo cargado');
        return detectPoseInRealTime(image, net);
    }, function(err) {window.postMessage(err);}).then(function(pose){
        window.postMessage(JSON.stringify(pose));
    },function(err) {window.postMessage(err);})
}, false);