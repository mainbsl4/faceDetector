import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const FacialExpressionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFacialExpressionDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      // Load the facemesh model
      const model = await tf.loadGraphModel('https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1', { fromTFHub: true });

      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;

      const faceDetection = async () => {
        const predictions = await model.estimateFaces({ input: video });
        console.log(predictions);
        // Implement your facial expression detection logic here
      };

      setInterval(faceDetection, 100);
    };

    runFacialExpressionDetection();

    return () => {
      // Cleanup code if needed
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} width="720" height="560" autoPlay muted></video>
      <canvas ref={canvasRef} width="720" height="560"></canvas>
    </div>
  );
};

export default FacialExpressionDetection;
