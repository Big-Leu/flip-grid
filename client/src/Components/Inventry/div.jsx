import { useEffect, useRef, useState } from 'react';

const VideoStream = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Setting video stream');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        console.log('MediaRecorder created', mediaRecorder.state);

        console.log('Data is available', mediaRecorder.ondataavailable);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && isRecording) {
            console.log('Data is available', event.data.size);
            socketRef.current.send(event.data);
          }
        };

        mediaRecorderRef.current = mediaRecorder;
      } catch (err) {
        console.error('Error accessing camera', err);
      }
    }

    // Open WebSocket connection on mount
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://127.0.0.1:8080/api/v1/form/ws');
      socketRef.current.onopen = () => console.log('WebSocket connected');
      socketRef.current.onclose = () => console.log('WebSocket closed');
      socketRef.current.onerror = (error) => console.error('WebSocket error', error);
    }

    startVideo();
  }, []);

  const handleToggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      socketRef.current.close();
    } else {
      mediaRecorderRef.current.start(100);  // Send video data every 100ms
    }
    setIsRecording(!isRecording);
  };
  return (
    <div className='min-h-[92.6vh] min-w-screen flex flex-row overflow-clip'>
        <div className="min-h-full max-w-[50%] flex flex-col mx-auto gap-y-[1rem]  my-auto">
            <video className="max-h-[30%] max-w-[50%] mx-auto" ref={videoRef} autoPlay />
            <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem] mx-auto rounded-md" onClick={handleToggleRecording}>
                {isRecording ? 'Stop' : 'Start'} Sending Feed
            </button>
        </div>
        <div className='min-h-full min-w-[50%] bg-stone-950'></div>
    </div>
  );
};

export default VideoStream;
