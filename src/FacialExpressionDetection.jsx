import React, { useEffect, useRef, useState } from 'react';

const FacialExpressionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [expression, setExpression] = useState('');

  useEffect(() => {
    const runFacialExpressionDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      // Load the facemesh model
      const model = await window.facemesh.load();

      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;

      const classifyExpression = (landmarks) => {
        // Calculate distances between key points to determine facial expressions
        const mouthLeft = landmarks[234]; // Index for left corner of mouth
        const mouthRight = landmarks[454]; // Index for right corner of mouth
        const mouthWidth = Math.abs(mouthLeft[0] - mouthRight[0]);

        const eyebrowLeft = landmarks[150]; // Index for left eyebrow
        const eyebrowRight = landmarks[216]; // Index for right eyebrow
        const eyebrowHeight = Math.abs(eyebrowLeft[1] - eyebrowRight[1]);

        // Determine expression based on distances
        if (mouthWidth > 60 && eyebrowHeight < 10) {
          setExpression('Happy');
        } else if (mouthWidth > 60 && eyebrowHeight >= 10) {
          setExpression('Surprised');
        } else if (mouthWidth < 40 && eyebrowHeight >= 10) {
          setExpression('Angry');
        } else {
          setExpression('Neutral');
        }
      };

      const faceDetection = async () => {
        const predictions = await model.estimateFaces(video);

        if (predictions.length > 0) {
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw facial landmarks
          predictions.forEach(prediction => {
            const keypoints = prediction.scaledMesh;
            keypoints.forEach(keypoint => {
              const [x, y] = keypoint;
              context.beginPath();
              context.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
              context.fillStyle = 'red';
              context.fill();
            });

            // Classify facial expression
            classifyExpression(keypoints);
          });
        }
      };

      setInterval(faceDetection, 100);
    };

    runFacialExpressionDetection();

    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    <div className='flex gap-5'>
     <div> 
        <video ref={videoRef} width="720" height="560" autoPlay muted></video>
      <canvas ref={canvasRef} width="720" height="560"></canvas>
      </div>
      <div>Detected Expression: {expression}</div>
    </div>
  );
};

export default FacialExpressionDetection;
