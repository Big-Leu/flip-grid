import React, { useEffect,useState, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

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
]

const VideoStream = () => {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage } = useWebSocket('ws://127.0.0.1:8080/api/v1/form/ws');

  useEffect(() => {
    const startStreaming = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef1.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Data is available', event.data.type, event.data.size, mediaRecorder.state);
          sendMessage(event.data);
        }
      };

      if (isRecording) {
        mediaRecorder.start(100); // Send data every 100ms
      } else {
        mediaRecorder.stop();
      }
    };

    startStreaming();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording, sendMessage]);

  const handleToggleRecording = () => {
    setIsRecording((prev) => !prev);
  };
  const urlmango = "https://s3-alpha-sig.figma.com/img/5706/e88d/549e105d65c1be2d8cd34273e09967d7?Expires=1729468800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g~sU~cvBDERq1fBvoxh5JJAPEt8WOD3I1zX1d8s8oCFHPnA4mT2PStBcfZzPVfr29aIsx9QEgro4gzL5dyMSylJJmpN7RdJOf6KwpzyLP3Xv7PLzrD75Niz-HzKqqfKRkXTRPDCnSxOSe87K7HgzhlxwwiMPG8KjQ4FU2DyxAASFOU9gSgKpscW4oIb83agb-qtX-gkmbN0cFX7hOSNGigU6cUMcc7BxXIc2sJrY36JA4FGNKINFUpSjZmCBbJF8Q7b5diz2cKegoUuIqkPYodFy1vZ-uAOsllqlOBfclbYjc6q~IkwLKpzXnHK2mA3aojkwqOPT3yAFemLH2HrTpQ__"
  return (
    <div className='min-h-[92.6vh] min-w-screen flex flex-row overflow-clip'>
      <div className="min-h-full min-w-[25%] flex flex-col">
        <div className='flex flex-col min-w-full mx-[10%]'>
           <div className='font-koulen text-stone-900'>
            <h1 className='text-4xl'>Monitor</h1>
            <h2 className='text-2xl mt-[.5rem]'>Camera Feeds</h2>
           </div>
           <div>
              <div className='mt-[1rem] '>
                <h1 className='font-koulen text-sm'>Angle one</h1>
                <video className=" max-w-[50%] rounded-md" ref={videoRef1} autoPlay muted/>
                <div className='flex-row mt-2'>
                  <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem]  rounded-sm mr-[1.5rem]" onClick={handleToggleRecording}>
                    Start 
                  </button>
                  <button className="bg-stone-950 text-stone-100 font-dangrek px-[1.5rem] py-[.5rem] rounded-sm ml-[1.5rem]" onClick={handleToggleRecording}>
                    End
                  </button>
                </div>
              </div>
              <div className='mt-[1rem] '>
                <h1 className='font-koulen text-sm'>Angle two</h1>
                <video className="min-h-[10%] max-w-[60%] " ref={videoRef2} autoPlay muted/>
                <div className='flex flex-row '>
                  <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem] rounded-sm mr-[1.5rem]" onClick={handleToggleRecording}>
                    Start 
                  </button>
                  <button className="bg-stone-950 text-stone-100 font-dangrek px-[1.5rem] py-[.5rem] rounded-sm ml-[1.5rem]" onClick={handleToggleRecording}>
                    End
                  </button>
                </div>
              </div>
              <div className='mt-[1rem] '>
                <h1 className='font-koulen text-sm'>Angle three</h1>
                <video className="min-h-[10%] max-w-[60%] " ref={videoRef3} autoPlay muted/>
                <div className='flex flex-row'>
                  <button className="bg-stone-950 text-stone-100 font-dangrek px-[1rem] py-[.5rem]  rounded-sm mr-[1.5rem]" onClick={handleToggleRecording}>
                    Start 
                  </button>
                  <button className="bg-stone-950 text-stone-100 font-dangrek px-[1.5rem] py-[.5rem] rounded-sm ml-[1.5REM]" onClick={handleToggleRecording}>
                    End
                  </button>
                </div>
              </div>
           </div>
      </div>
      </div >
        <div className='min-h-full min-w-[75%] bg-[#121417] flex flex-col overflow-hidden '>
          <div className='ml-[2rem] mt-[2rem]'>
            <h1 className='text-stone-50 font-koulen text-4xl mt-1'>FreshSmart</h1>
            <div className='flex flex-row mt-[2rem]'>
               <img  className='w-[226px] h-[226px] relative rounded-sm' src={urlmango} ></img>
               <div className='ml-[2rem] min-w-full'>
                 <h1 className='font-koulen text-slate-100 text-xl'>product detail</h1>
                 <div className='bg-[#6F6B6B] min-h-1 max-w-[70%]'></div>
                 <div className='flex flex-row'>
                     <div className=' mt-[1rem] space-y-[1rem]  '>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>brand name</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[4rem]'>Xyx brand</label>
                        </div>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>mrp</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[7rem]'>Xyx brand</label>
                        </div>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>item description</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[2rem]'>Xyx brand</label>
                        </div>
                        <div className=''>
                          <label className='font-koulen text-stone-50'>object type</label>
                          <label className='font-koulen text-[#6B6B6B] ml-[3.8rem]'>Xyx brand</label>
                        </div> 
                     </div>
                      <div className='ml-[14rem] mt-[1rem] font-koulen'>
                        <h1 className='text-slate-100 text-2xl'>Fressness indication</h1>
                        <h1 className='text-slate-100 text-2xl mt-[1rem] ml-[5rem]'>65.9 %</h1>
                        <h1 className='text-slate-100 text-sm/5 ml-[3rem]'>edible range - <span className='text-emerald-500'> 70-100%</span></h1>
                        <div className='flex flex-row space-x-[7.2rem] mt-[1rem]'>
                          <h1 className='text-slate-100 text-md '>rotten</h1>
                          <h1 className='text-slate-100 text-md'>fresh</h1>
                        </div>
                      </div>
                 </div>
               </div>
            </div>
          </div>
          <div className='ml-[2rem] mt-[3rem] flex flex-col'>
            <h1 className='font-koulen text-stone-100 text-4xl'>Scanned items</h1>
            <div className='flex flex-col font-koulen mt-[1rem] overflow-y-auto space-y-[1rem] scrollbar-none'>
              {data.map((data)=>(
                <div className=''>
                  <h1 className='text-stone-100 text-xl'>{data.name}</h1>
                  <div className='flex flex-row space-x-3'>
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
