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

      const classifyExpression = async (landmarks) => {
        // Use pre-trained model for emotion recognition
        const emotionPredictions = await window.emotionModel.predict(tf.tensor(landmarks));
        const emotionLabels = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
        const maxIndex = emotionPredictions.indexOf(Math.max(...emotionPredictions));
        setExpression(emotionLabels[maxIndex]);
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
    <div>
      <video ref={videoRef} width="720" height="560" autoPlay muted></video>
      <canvas ref={canvasRef} width="720" height="560"></canvas>
      <div>Detected Expression: {expression}</div>
    </div>
  );
};

export default FacialExpressionDetection;
