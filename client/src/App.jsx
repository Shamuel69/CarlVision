import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'
import About from './About.jsx'
import { Routes, Route, Link, } from 'react-router-dom';
import { ChevronLeft, Info } from "lucide-react";

function Home() {
  return (
    <div className="w-full  flex flex-col items-start bg-(--bg-primary) text-(--text-primary) p-8 md:p-16 lg:p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to CarlVision</h1>
      <p className="text-lg mb-8">Upload an image and experiment with the various filters of Image Processing.</p>
      <Link to="/app" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
        Get Started
      </Link>
    </div>
  );
}

function ImagePageBase() {
  const [myValue, setMyValue] = useState({})
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageAttributes, setImageAttributes] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState(false);
  
  useEffect(() => {
  if (!image) {
    setImagePreview(null);
    return;
  }
  const url = URL.createObjectURL(image);
  setImagePreview(url);

  return () => URL.revokeObjectURL(url);
}, [image]);

  useEffect(() => {
    if (!image) return;
    const timer = setTimeout(() => { 
      console.log("value: ", myValue, )
      formRef.current?.requestSubmit();
    }, 500);
    setError(null);
    return () => clearTimeout(timer);
  }, [myValue, image])

  useEffect(() =>{
    if (imageAttributes){
      console.log("attributes: ", imageAttributes);
      localStorage.setItem("Attributes", JSON.stringify({channels: imageAttributes.Channels, dimensions: [imageAttributes.Dimensions[0], imageAttributes.Dimensions[1]]}))
    }
  }, [imageAttributes])

  const uploadImageOnSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const configs = Object.fromEntries(
      formData.entries()
    );
    const totalconfigs = {};
    const fixedConfigs = {};

    totalconfigs.GB = {name: "Gaussian Blur", kernalsize: Number(configs.gaussianBlurKernalSize)};
    totalconfigs.MB = {name: "Median Blur", kernalsize: Number(configs.medianBlurKernalSize)};
    totalconfigs.BB = {name: "Bilateral Filter", diameter: Number(configs.bilateralBlurDiameter), sigmaColor: Number(configs.bilateralBlurSigmaColor), sigmaSpace: Number(configs.bilateralBlurSigmaSpace)};
    totalconfigs.CF = {name: "Canny Filter", threshold1: Number(configs.cannyFilterThreshold1), threshold2: Number(configs.cannyFilterThreshold2)};
    
    Object.keys(totalconfigs).forEach((key) => {
      Object.keys(totalconfigs[key]).forEach((subkey) => {
        if (typeof totalconfigs[key][subkey] === 'number' && totalconfigs[key][subkey] > 1) {
            fixedConfigs[key] = {...totalconfigs[key]}; 
          }
        })
      }
    );
    
    formData.append("image", image);
    formData.append("config", JSON.stringify(fixedConfigs));

    try{
      const res = await axios.post('http://localhost:8080/api/upload', formData, {responseType:"blob"})
      const res2 = await axios.post('http://localhost:8080/api/imageattributes', formData, )
      console.log("Recieved processed image response! ", res2.data)
      const imageURL = URL.createObjectURL(res.data);
      setUploadedImage(imageURL);
      setImageAttributes(res2.data)
    }catch (err){
      setError( err)
      console.error('Error uploading image: ', err)
    }
  }

  const handleImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError(null);
    setImage(file);
    setUploadedImage(null);
    setImageAttributes(null);
  };


  const handleImageChange = (e) => {
    e.preventDefault()
    handleImageFile(e.target.files[0]);
  }

  return (
    <div id="content" className="lg:w-full  lg:px-0 relative mx-auto  flex flex-row gap-2.5">
          <section id="image_" className="flex-1  min-w-0">
            <div className=" w-[90%] sm:w-full  py-3 sm:p-3 flex flex-col gap-4">
              {error && (
                
                <div className="w-full bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg text-sm">
                  <span className="font-semibold">Processing error:</span> {error}
                </div>
              )}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* input image */}
                <div className="flex flex-col sm:rounded-xl overflow-hidden border border-(--border) py-3 sm:p-4 " >
                  <div className="flex items-center justify-between px-1.5 sm:px-4 py-3 border-b border-(--border)">
                    <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Original Image: 
                    </div>
                  </div>
                  <div className={` relative min-h-[320px] h-[520px] flex flex-col justify-center items-center transition-all duration-200 cursor-pointer ${isDragging ? "bg-(--bg-tertiary) border-2 border-(--accent)" : ""}`} 
                  onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
                  onDragLeave={(e) => {if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);}}
                  onDrag={(e) => e.preventDefault()} onDrop={(e) => {e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; handleImageFile(file);}} >
                    <label htmlFor="fileInput" className="">
                      {image ? (
                        <span className="text-sm text-(--text-secondary) p-1.5 hover:border hover:border-blue-400 transition-all duration-200">Change your image</span>
                      ) : (
                        <span className="text-sm text-(--text-secondary) ">Drag and drop an image here, or click to select one</span>
                      )}
                      <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} className="hidden"/>
                    </label>
                    {image && <img src={imagePreview} alt="Dropped" className="object-scale-down  max-h-130 p-4" />}

                  </div>
                  {/* image attributes */}

                  <div className="flex flex-row justify-between gap-2 px-4 py-3 border-t border-(--border)">
                  <div className="flex flex-row justify-between w-full  mx-auto  gap-2">
                      <div className="rounded-lg bg-(--bg-tertiary) p-3">
                        <p className="text-sm text-(--text-muted) mb-1">Dimensions</p>
                        <p className="font-semibold">
                          {imageAttributes
                            ? `${imageAttributes.Dimensions[0]} × ${imageAttributes.Dimensions[1]}`
                            : "-- x --"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-(--bg-tertiary) p-3">
                        <p className="text-sm text-(--text-muted) mb-1">Channels</p>
                        <p className="font-semibold">
                          {imageAttributes?.Channels ?? "--"}
                        </p>
                      </div>
                  </div>
                </div>
                </div>
                <div className="flex flex-col sm:rounded-xl overflow-hidden border border-(--border) py-3 sm:p-4 " >
                  <div className="flex items-center justify-between px-1.5 sm:px-4 py-3 border-b border-(--border)">
                    <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Processed Image: 
                    </div>
                  </div>
                  <div className="relative min-h-[320px] h-[520px] flex flex-col justify-center items-center" >
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Processed" className="object-scale-down  max-h-130 p-4" />
                    ) : (
                      <span className="text-sm text-(--text-secondary) ">Your processed image will appear here after applying configurations.</span>
                    )}
                  </div>
                  <div className="flex flex-row justify-between gap-2 px-4 py-3 border-t border-(--border)">
                  <div className="flex flex-row justify-between w-full  mx-auto  gap-2">
                      <div className="rounded-lg bg-(--bg-tertiary) p-3">
                        <p className="text-sm text-(--text-muted) mb-1">Status</p>
                        <p className="font-semibold">
                          {uploadedImage ? "Complete" : "Waiting"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-(--bg-tertiary) p-3">
                        <p className="text-sm text-(--text-muted) mb-1">Output</p>
                        <p className="font-semibold">
                          {uploadedImage ? "PNG" : "--"}
                        </p>
                      </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </section>
          <section id="inputs" className={`w-[320px] h-full fixed top-0 right-0  transition-transform duration-300  ${activeTab ? "translate-x-0" : "translate-x-[calc(100%-4rem)]"} lg:static lg:w-[360px] lg:translate-x-0 `}>
            <form ref={formRef} onSubmit={uploadImageOnSubmit} className={`w-[97%] sm:w-full h-full flex flex-col border-l border-(--border) bg-(--bg-primary) shadow-2xl p-2 sm:p-4 gap-4 overflow-y-auto `}>
              <h2 onClick={() => setActiveTab(prev => !prev)} className="cursor-pointer flex lg:hidden">
                <ChevronLeft className={`w-7 h-7  transition-transform duration-300 ${activeTab ? "rotate-180" : "rotate-0"}`}/>
              </h2>
              <div className={`lg:flex flex-col gap-4  ${activeTab ? "flex" : "hidden"} `}>
                <div className={`flex items-center justify-between border-b border-(--border) pb-3`}>
                  <div>
                    <h3 className="text-lg font-semibold text-(--text-primary)">Configurations</h3>
                    <p className="text-xs text-(--text-muted)">Adjust image processing parameters</p>
                  </div>
                  <span className="text-xs text-(--text-muted) font-mono">CV / 01</span>
                  {/* ^^kinda like a page number, but not really since i havent made a second page of configurations yet. but i will eventually. maybe. idk. */}
                </div>

                <div className="flex flex-col gap-3">

                  <section className="flex flex-col gap-3 rounded-lg border border-(--border) bg-(--bg-secondary) p-3">
                    <div className="flex items-center gap-2 relative group">
                      <span className="h-2 w-2 rounded-full bg-(--accent) "></span>
                      <h4 className="font-semibold relative text-(--text-primary) ">Gaussian Blur</h4>
                      <div className="relative">
                        <Info className="w-4 h-4 text-(--text-muted)"/>
                        <div className="absolute translate-x-[-20%] bottom-full  w-64  flex items-center gap-1 opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible  transition-opacity duration-200
                          group-focus-within:opacity-100 group-focus-within:visible
                          bg-(--bg-secondary) border border-(--border) rounded-lg p-2 text-(--text-primary) text-xs z-10">
                          <span className="text-xs text-(--text-muted)">Smooths an image by reducing detail and noise.
                                                                        Larger kernel sizes create a stronger blur.</span>
                        </div>
                      </div>
                      
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-(--text-secondary)">Kernel Size</label>
                      <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                        <span>1</span>
                        <span className="text-(--accent) font-semibold">{myValue.GB?.kernalsize ?? 1}</span>
                        <span>31</span>
                      </div>
                      <input type="range" name="gaussianBlurKernalSize" min={1} max={31} step={2} value={myValue.GB?.kernalsize ?? 1} onChange={(e) => setMyValue({...myValue, GB:{name: "Gaussian Blur", kernalsize: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                    </div>
                  </section>

                  <section className="flex flex-col gap-3 rounded-lg border border-(--border) bg-(--bg-secondary) p-3">
                    <div className="flex items-center gap-2 relative group">
                      <span className="h-2 w-2 rounded-full bg-(--accent) "></span>
                      <h4 className="font-semibold relative text-(--text-primary) ">Median Blur</h4>
                      <div className="relative">
                        <button type="button" className=" " aria-label="Info">
                          <Info className="w-4 h-4 text-(--text-muted)"/>
                        </button>
                        <div className="absolute translate-x-[-20%] bottom-full  w-64  flex items-center gap-1 opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible  transition-opacity duration-200
                          group-focus-within:opacity-100 group-focus-within:visible
                          bg-(--bg-secondary) border border-(--border) rounded-lg p-2 text-(--text-primary) text-xs z-10">
                          <span className="text-xs text-(--text-muted)">Removes small noise and isolated pixels by replacing each pixel with the median value of its surrounding neighborhood. Particularly useful for salt-and-pepper noise.</span>
                        </div>
                      </div>
                      
                    </div>
                    <div className="flex flex-col gap-2">
                    
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-(--text-secondary)">Kernel Size</label>
                      <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                        <span>1</span>
                        <span className="text-(--accent) font-semibold">{myValue.MB?.kernalsize ?? 1}</span>
                        <span>31</span>
                      </div>
                      <input type="range" name="medianBlurKernalSize" min={1} max={31} step={2} value={myValue.MB?.kernalsize ?? 1} onChange={(e) => setMyValue({...myValue, MB:{name: "Median Blur", kernalsize: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                    </div>
                  </section>

                  <section className="flex flex-col gap-3 rounded-lg border border-(--border) bg-(--bg-secondary) p-3">
                    <div className="flex items-center gap-2 relative group">
                      <span className="h-2 w-2 rounded-full bg-(--accent) "></span>
                      <h4 className="font-semibold relative text-(--text-primary) ">Bilateral Filter</h4>
                      <div className="relative">
                        <button type="button" className="" aria-label="Info">
                          <Info className="w-4 h-4 text-(--text-muted)"/>
                        </button>
                        <div className="absolute translate-x-[-20%] bottom-full  w-64  flex items-center gap-1 opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible  transition-opacity duration-200
                          group-focus-within:opacity-100 group-focus-within:visible
                          bg-(--bg-secondary) border border-(--border) rounded-lg p-2 text-(--text-primary) text-xs z-10">
                          <span className="text-xs text-(--text-muted)">Reduces noise while preserving edges. Unlike ordinary blurring, it considers both pixel distance and color similarity.</span>
                        </div>
                      </div>
                      
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-(--text-secondary)">Diameter</label>
                        <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                          <span>1</span>
                          <span className="text-(--accent) font-semibold">{myValue.BB?.diameter ?? 1}</span>
                          <span>15</span>
                        </div>
                        <input type="range" name="bilateralBlurDiameter" min={1} max={15} step={2} value={myValue.BB?.diameter ?? 1} onChange={(e) => setMyValue({...myValue, BB:{...myValue.BB, name: "Bilateral Filter", diameter: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-(--text-secondary)">Sigma Color</label>
                        <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                          <span>1</span>
                          <span className="text-(--accent) font-semibold">{myValue.BB?.sigmaColor ?? 1}</span>
                          <span>150</span>
                        </div>
                        <input type="range" name="bilateralBlurSigmaColor" min={1} max={150} step={2} value={myValue.BB?.sigmaColor ?? 1} onChange={(e) => setMyValue({...myValue, BB:{...myValue.BB, name: "Bilateral Filter", sigmaColor: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-(--text-secondary)">Sigma Space</label>
                        <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                          <span>1</span>
                          <span className="text-(--accent) font-semibold">{myValue.BB?.sigmaSpace ?? 1}</span>
                          <span>150</span>
                        </div>
                        <input type="range" name="bilateralBlurSigmaSpace" min={1} max={150} step={2} value={myValue.BB?.sigmaSpace ?? 1} onChange={(e) => setMyValue({...myValue, BB:{...myValue.BB, name: "Bilateral Filter", sigmaSpace: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                      </div>
                    </div>
                  </section>

                  <section className="flex flex-col gap-3 rounded-lg border border-(--border) bg-(--bg-secondary) p-3">
                    <div className="flex items-center gap-2 relative group">
                      <span className="h-2 w-2 rounded-full bg-(--accent) "></span>
                      <h4 className="font-semibold relative text-(--text-primary) ">Canny Filter</h4>
                      <div className="relative">
                        <button type="button" className="" aria-label="Info">
                          <Info className="w-4 h-4 text-(--text-muted)"/>
                        </button>
                        <div className="absolute translate-x-[-20%] bottom-full  w-64  flex items-center gap-1 opacity-0 invisible 
                          group-hover:opacity-100 group-hover:visible  transition-opacity duration-200
                          group-focus-within:opacity-100 group-focus-within:visible
                          bg-(--bg-secondary) border border-(--border) rounded-lg p-2 text-(--text-primary) text-xs z-10">
                          <span className="text-xs text-(--text-muted)">Detects edges by identifying strong changes in image intensity. Lower and upper thresholds control which edges are retained.</span>
                        </div>
                      </div>
                      
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-(--text-secondary)">Lower Threshold</label>
                        <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                          <span>1</span>
                          <span className="text-(--accent) font-semibold">{myValue.CF?.threshold1 ?? 1}</span>
                          <span>250</span>
                        </div>
                        <input type="range" name="cannyFilterThreshold1" min={1} max={250} step={2} value={myValue.CF?.threshold1 ?? 1} onChange={(e) => setMyValue({...myValue, CF:{...myValue.CF, name: "Canny Filter", threshold1: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm text-(--text-secondary)">Upper Threshold</label>
                        <div className="flex justify-between text-xs font-mono text-(--text-muted)">
                          <span>1</span>
                          <span className="text-(--accent) font-semibold">{myValue.CF?.threshold2 ?? 1}</span>
                          <span>350</span>
                        </div>
                        <input type="range" name="cannyFilterThreshold2" min={1} max={350} step={2} value={myValue.CF?.threshold2 ?? 1} onChange={(e) => setMyValue({...myValue, CF:{...myValue.CF, name: "Canny Filter", threshold2: Number(e.target.value)}})} className="w-full cursor-pointer accent-(--accent)"/>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

            </form>
          </section>
        </div>
  )
}


function App() {
  return (
    <>
      <div className="min-h-screen md:min-h-dvh ">
        <section id="header">
          <div className="w-full  bg-(--bg-primary)  text-xl text-(--text-primary) border-b-2 border-(--border)">
            <div className='w-[90%] p-2.5 mx-auto flex flex-row items-center justify-between '>
              <Link to="/" className="relative group text-2xl">
                    CarlVision<span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 origin-center bg-(--accent) transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
              <div className="">
                <Link to="/about" className="relative group text-xl">
                    About CarlVision<span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 origin-center bg-(--accent) transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
              </div>

            </div>
          </div>
        </section>

        <section id="display-area" className="w-full min-h-[calc(100vh-54px)] bg-(--bg-primary) text-(--text-primary)">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/app" element={<ImagePageBase/>}/>
            <Route path="/about" element={<About/>}/>
          </Routes>
        </section>

        
      
      </div>



    </>
  )
}

export default App
