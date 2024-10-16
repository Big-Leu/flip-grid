import React, { useEffect, useState, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';

const data = [
  {
    "name": "Fortune Sunlite Refined Sunflower Oil",
    "expiry_date": "15 July 2023",
    "mrp": "15 July 2023",
    "description": "15 July 2023"
  },
  {
    "name": "Fortune Sunlite Refined Sunflower Oil",
    "expiry_date": "15 July 2023",
    "mrp": "15 July 2023",
    "description": "15 July 2023"
  },
  {
    "name": "Example Product Name",
    "expiry_date": "01 January 2024",
    "mrp": "150 INR",
    "description": "An example description here"
  },
  {
    "name": "Another Example Product",
    "expiry_date": "20 December 2023",
    "mrp": "200 INR",
    "description": "Another example description here"
  }
];
const VideoStream = () => {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const mediaRecorderRef1 = useRef(null);
  const mediaRecorderRef2 = useRef(null);
  const mediaRecorderRef3 = useRef(null);
  const [isRecording1, setIsRecording1] = useState(false);
  const [isRecording2, setIsRecording2] = useState(false);
  const [isRecording3, setIsRecording3] = useState(false);
  const [devices, setDevices] = useState([]);
  const [detaillist, setdetaillist] = useState([]);
  const [selectedDeviceId1, setSelectedDeviceId1] = useState(null);
  const [selectedDeviceId2, setSelectedDeviceId2] = useState(null);
  const [selectedDeviceId3, setSelectedDeviceId3] = useState(null);
  const [productInfo, setProductInfo] = useState({
    brandName: "Brand not available",
    mrpValue: "MRP not available",
    expiryDate: "Expiry date not available",
    freshStatus: "Freshness status not available",
    confidence: "Confidence not available"
  });
  const URL = "http://localhost:8000"
  const [isReloading,setReloading] = useState(false);
  const handleClick = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/form/list?page=1&size=50`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { result } = await response.json();
        console.log(result.length);
        setdetaillist(result)
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    setReloading(true);
    setTimeout(() => {
      setReloading(false);
    }, 2000);
  };

  const getslots = async () => {
    try {
      const vid1=lastMessage1.data
      const vid2=lastMessage2.data  
      const raw = JSON.stringify([
        `backend/services/video/${vid1}.mkv`,
        `backend/services/video/${vid2}.mkv`
      ]);
      const response = await fetch(`${URL}/api/v1/form/fill`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: raw,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { result } = await response.json();
      console.log(result.length);
      if (result.length > 0) {
        const itemInfo = result[0] || {};
  
        const updatedProductInfo = {
          brandName: itemInfo.name || "Brand not available",
          mrpValue: itemInfo.mrp || "MRP not available",
          expiryDate: itemInfo.expiry_date || "Expiry date not available",
          freshStatus: itemInfo["Predicted Class"] || "Freshness status not available",
          confidence: itemInfo.Confidence ? itemInfo.Confidence[0].toFixed(2) : "Confidence not available"
        };
  
        setProductInfo(updatedProductInfo);
      }
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const { sendMessage: sendMessage1, lastMessage: lastMessage1 } = useWebSocket('ws://127.0.0.1:8000/api/v1/form/ws', {
    onOpen: () => console.log('WebSocket 1 connection opened.'),
    onClose: () => console.log('WebSocket 1 connection closed.'),
    onError: (event) => console.error('WebSocket 1 error:', event),
  });

  const { sendMessage: sendMessage2, lastMessage: lastMessage2 } = useWebSocket('ws://127.0.0.1:8000/api/v1/form/ws', {
    onOpen: () => console.log('WebSocket 2 connection opened.'),
    onClose: () => console.log('WebSocket 2 connection closed.'),
    onError: (event) => console.error('WebSocket 2 error:', event),
  });

  const { sendMessage: sendMessage3, lastMessage: lastMessage3 } = useWebSocket('ws://127.0.0.1:8000/api/v1/form/ws', {
    onOpen: () => console.log('WebSocket 3 connection opened.'),
    onClose: () => console.log('WebSocket 3 connection closed.'),
    onError: (event) => console.error('WebSocket 3 error:', event),
  });

  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);

      setSelectedDeviceId1(videoDevices.length > 0 ? videoDevices[0].deviceId : null);
      setSelectedDeviceId2(videoDevices.length > 1 ? videoDevices[1].deviceId : null);
      setSelectedDeviceId3(videoDevices.length > 2 ? videoDevices[2].deviceId : null);
    };

    getCameras();
  }, []);

  useEffect(() => {
    if (lastMessage1) {
      console.log('Message from camera 1:', lastMessage1.data);
    }
  }, [lastMessage1]);

  useEffect(() => {
    if (lastMessage2) {
      console.log('Message from camera 2:', lastMessage2.data);
    }
  }, [lastMessage2]);

  useEffect(() => {
    if (lastMessage3) {
      console.log('Message from camera 3:', lastMessage3.data);
    }
  }, [lastMessage3]);

  const startStreaming = async (videoRef, deviceId, mediaRecorderRef, sendMessage ,isRecording) => {
    if (!deviceId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          sendMessage(event.data);
        }
      };

      if (isRecording) {
        mediaRecorder.start(100); // Start recording
      } else if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  useEffect(() => {
    if (isRecording1) {
      startStreaming(videoRef1, selectedDeviceId1, mediaRecorderRef1, sendMessage1,isRecording1);
    } else {
      if (mediaRecorderRef1.current && mediaRecorderRef1.current.state !== 'inactive') mediaRecorderRef1.current.stop();
    }
    return () => {
      [mediaRecorderRef1].forEach((ref) => {
        if (ref.current && ref.current.state !== 'inactive') ref.current.stop();
      });

      [videoRef1].forEach((ref) => {
        if (ref.current && ref.current.srcObject) {
          const stream = ref.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      });
    };
  }, [isRecording1]);
  useEffect(() => {

    if (isRecording2) {
      startStreaming(videoRef2, selectedDeviceId2, mediaRecorderRef2, sendMessage2,isRecording2);
    } else {
      if (mediaRecorderRef2.current && mediaRecorderRef2.current.state !== 'inactive') mediaRecorderRef2.current.stop();
    }
    return () => {
      [mediaRecorderRef2].forEach((ref) => {
        if (ref.current && ref.current.state !== 'inactive') ref.current.stop();
      });

      [ videoRef2].forEach((ref) => {
        if (ref.current && ref.current.srcObject) {
          const stream = ref.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      });
    };
  }, [isRecording2]);
  useEffect(() => {

    if (isRecording3) {
      startStreaming(videoRef3, selectedDeviceId3, mediaRecorderRef3, sendMessage3,isRecording3);
    } else {
      if (mediaRecorderRef3.current && mediaRecorderRef3.current.state !== 'inactive') mediaRecorderRef3.current.stop();
    }

    return () => {
      [mediaRecorderRef3].forEach((ref) => {
        if (ref.current && ref.current.state !== 'inactive') ref.current.stop();
      });

      [videoRef3].forEach((ref) => {
        if (ref.current && ref.current.srcObject) {
          const stream = ref.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      });
    };
  }, [isRecording3]);

  const handleToggleRecording1 = () => {
    setIsRecording1(prev => !prev);
  };
  const handleToggleRecording2 = () => {
    setIsRecording2(prev => !prev);
  };
  const handleToggleRecording3 = () => {
    setIsRecording3(prev => !prev);
  };
  const urlmango = "https://s3-alpha-sig.figma.com/img/5706/e88d/549e105d65c1be2d8cd34273e09967d7?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g~sU~cvBDERq1fBvoxh5JJAPEt8WOD3I1zX1d8s8oCFHPnA4mT2PStBcfZzPVfr29aIsx9QEgro4gzL5dyMSylJJmpN7RdJOf6KwpzyLP3Xv7PLzrD75Niz-HzKqqfKRkXTRPDCnSxOSe87K7HgzhlxwwiMPG8KjQ4FU2DyxAASFOU9gSgKpscW4oIb83agb-qtX-gkmbN0cFX7hOSNGigU6cUMcc7BxXIc2sJrY36JA4FGNKINFUpSjZmCBbJF8Q7b5diz2cKegoUuIqkPYodFy1vZ-uAOsllqlOBfclbYjc6q~IkwLKpzXnHK2mA3aojkwqOPT3yAFemLH2HrTpQ__"
  return (
    <div className='min-h-[100vh] min-w-screen flex flex-row'>
      <div className="min-h-full min-w-[25%] flex flex-col">
        <div className='flex flex-col min-w-full mx-[10%]'>
          <div className='font-koulen text-stone-900'>
            <h1 className='text-4xl'>Monitor</h1>
            <h2 className='text-2xl mt-[.5rem]'>Camera Feeds</h2>
          </div>
          <div>
            <div className='mt-[1rem] font-koulen'>
              <h1 className='ml-1'>Angle One</h1>
              <select  onChange={(e) => setSelectedDeviceId1(e.target.value)} value={selectedDeviceId1}  className='mb-4'>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>
              <video className="max-w-[50%] rounded-md" ref={videoRef1} autoPlay muted />
              <div className='flex-row mt-2'>
                <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem] rounded-sm mr-[1.5rem]" onClick={handleToggleRecording1}>
                  Start
                </button>
                <button className="bg-stone-950 text-stone-100 font-dangrek px-[1.5rem] py-[.5rem] rounded-sm ml-[1.5rem]" onClick={handleToggleRecording1}>
                  End
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className='mt-[1rem] font-koulen'>
            <h1 className='ml-1'>Angle Two</h1>
              <select  onChange={(e) => setSelectedDeviceId2(e.target.value)} value={selectedDeviceId2}  className='mb-4'>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>
              <video className="max-w-[50%] rounded-md" ref={videoRef2} autoPlay muted />
              <div className='flex-row mt-2'>
                <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem] rounded-sm mr-[1.5rem]" onClick={handleToggleRecording2}>
                  Start
                </button>
                <button className="bg-stone-950 text-stone-100 font-dangrek px-[1.5rem] py-[.5rem] rounded-sm ml-[1.5rem]" onClick={handleToggleRecording2}>
                  End
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className='mt-[1rem] font-koulen'>
            <h1 className='ml-1'>Angle Three</h1>
              <select  onChange={(e) => setSelectedDeviceId3(e.target.value)} value={selectedDeviceId3}  className='mb-4'>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId} >
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>
              <video className="max-w-[50%] rounded-md" ref={videoRef3} autoPlay muted />
              <div className='flex-row mt-2'>
                <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem] rounded-sm mr-[1.5rem]" onClick={handleToggleRecording3}>
                  Start
                </button>
                <button className="bg-stone-950 text-stone-100 font-dangrek px-[1.5rem] py-[.5rem] rounded-sm ml-[1.5rem]" onClick={handleToggleRecording3}>
                  End
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
        <div className='min-h-full min-w-[75%] bg-[#121417] flex flex-col'>
          <div className='ml-[2rem] mt-[2rem]'>
            <h1 className='text-stone-50 font-koulen text-4xl mt-1' onClick={getslots}>FreshSmart</h1>
            <div className='flex flex-row mt-[2rem]'>
               {/* <img  className='w-[226px] h-[226px] relative rounded-sm' src={urlmango}  alt='productImage'></img> */}
               <div className='min-w-full'>
                 <h1 className='font-koulen text-slate-100 text-xl'>product detail</h1>
                 <div className='bg-[#6F6B6B] min-h-1 max-w-[90%] mt-2'></div>
                 <div className='flex flex-row'>
                     <div className=' mt-[1rem] space-y-[1rem]  '>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>brand name</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[4rem]'>{productInfo.brandName}</label>
                        </div>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>mrp</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[7rem]'>{productInfo.mrpValue}</label>
                        </div>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>Expiry</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[6rem]'>{productInfo.expiryDate}</label>
                        </div>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>object type</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[3.8rem]'>{productInfo.freshStatus}</label>
                        </div> 
                     </div>
                      <div className='ml-[14rem] mt-[1rem] font-koulen'>
                        <h1 className='text-slate-100 text-2xl'>Fressness indication</h1>
                        <h1 className={`text-2xl mt-[1rem] ${productInfo.confidence < 70 ? 'text-red-500' : 'text-emerald-500'} ${productInfo.confidence.toLowerCase().includes('confidence not available') ? 'ml-[-1rem]' : 'ml-[5.5rem]'}`}>{productInfo.confidence}</h1>
                        <h1 className='text-slate-100 text-sm/5 ml-[3rem]'>edible range - <span className='text-emerald-500'> 70-100%</span></h1>
                        <div className='flex flex-row space-x-[8rem] mt-[1rem]'>
                          <h1 className={`text-md ${productInfo.freshStatus.toLowerCase().includes('rotten') ? 'text-red-500' : 'text-slate-100'}`}>rotten</h1>
                          <h1 className={`text-md  ${productInfo.freshStatus.toLowerCase().includes('fresh') ? 'text-emerald-500' : 'text-slate-100 '}`}>fresh</h1>
                        </div>
                      </div>
                 </div>
               </div>
            </div>
          </div>
          <div className='ml-[2rem] mt-[10vh] flex flex-col'>
            <div className='flex flex-row gap-x-[33rem]'>
              <h1 className='font-koulen text-stone-100 text-4xl'>Scanned items</h1>
              <button
                className={`font-koulen font-extrabold text-xl bg-emerald-500 rounded-md px-4 hover:bg-emerald-600 transition-all duration-300 ease-in-out ${isReloading ? 'cursor-not-allowed' : ''}`}
                onClick={handleClick}
                disabled={isReloading} 
              >
                {isReloading ? 'Reloading...' : 'Reload'}
              </button>
            </div>
            <div className='flex flex-col font-koulen mt-[1rem] space-y-[1rem]  overflow-y-scroll  overflow-x-hidden max-h-[30vh] scrollbar-none'>
              {detaillist.map((data)=>(
                <div className='' key={uuidv4()}>
                  <h1 className='text-stone-100 text-xl'>{data.name}</h1>
                  <div className='flex flex-row space-x-[5rem]'>
                    <label className='text-[#9CABBA]'>Expiry date: <span>{data.expiry_date}</span></label>
                    <label className='text-[#9CABBA]'>MRP: <span>{data.mrp}</span></label>
                    <label className='text-[#9CABBA]'>Description: <span>{data.description}</span></label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};
 
export default VideoStream;
