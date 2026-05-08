"use client";
import React from "react";
import { ChevronDown, Undo2, Redo2, Eye, Send, X, Image as ImageIcon, Save } from "lucide-react";
import { useBuilder, BuilderElement } from "./BuilderContext";

export default function MainCanvas() {
  const { elements, activeElementId, setActiveElementId, undo, redo, historyStack, futureStack } = useBuilder();

  const mountainSrc1 = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80";
  const mountainSrc2 = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80";

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Dynamic button styles mapper
  const getStyleClass = (style: BuilderElement["buttonStyle"]) => {
    switch (style) {
      case "circle": return "rounded-full";
      case "square": return "rounded-none";
      case "video": return "rounded-lg border-2 border-dashed";
      case "play": return "rounded-tr-xl rounded-bl-xl";
      default: return "rounded-md";
    }
  };

  const handleAction = (action: string) => {
    alert(`${action} functionality triggered successfully!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a fully functional app, this would upload the file to a server or process it locally.
      alert(`Successfully selected file: ${file.name}`);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="flex-1 bg-[#f0f2f5] flex flex-col h-full overflow-hidden relative">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,video/*"
      />

      {/* Top Bar */}
      <div className="h-[60px] sm:h-[68px] bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-sm z-10 mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-t-xl">
        <div className="flex justify-between items-center w-full gap-2 sm:gap-0">
          {/* Left area */}
          <button 
            onClick={() => handleAction("Switch Website")}
            className="flex items-center gap-1 sm:gap-2 text-slate-800 font-bold hover:text-blue-600 transition-colors cursor-pointer shrink-0"
          >
            <span className="text-[13px] sm:text-[15px] border-b-2 border-[#0c1b33] pb-0.5 whitespace-nowrap">My Website</span>
            <ChevronDown size={18} className="text-slate-500 mb-0.5 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Middle area - Undo/Redo */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden shrink-0">
            <button 
              onClick={undo}
              disabled={historyStack.length <= 1}
              className={`px-2 sm:px-3 py-1.5 transition-colors border-r border-slate-300 ${historyStack.length > 1 ? 'text-slate-700 hover:bg-slate-100 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`}
            >
              <Undo2 size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={redo}
              disabled={futureStack.length === 0}
              className={`px-2 sm:px-3 py-1.5 transition-colors ${futureStack.length > 0 ? 'text-slate-700 hover:bg-slate-100 cursor-pointer' : 'text-slate-300 cursor-not-allowed'}`}
            >
              <Redo2 size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {/* Right area - Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
            <button onClick={() => handleAction("Save Draft")} className="px-2 sm:px-2.5 lg:px-4 py-1.5 text-[14px] font-semibold text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer" title="Save Draft">
              <Save size={16} className="lg:hidden" />
              <span className="hidden lg:inline">Save Draft</span>
            </button>
            <button onClick={() => handleAction("Preview")} className="px-2 sm:px-2.5 lg:px-4 py-1.5 text-[14px] font-semibold text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer" title="Preview">
              <Eye size={16} />
              <span className="hidden lg:inline">Preview</span>
            </button>
            <button onClick={() => handleAction("Publish")} className="px-2 sm:px-2.5 lg:px-4 py-1.5 text-[14px] font-semibold text-white bg-[#0c1b33] rounded-md hover:bg-blue-900 transition-colors flex items-center gap-2 cursor-pointer" title="Publish">
              <span className="hidden lg:inline">Publish</span>
              <Send size={15} className="-mt-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar" onClick={() => setActiveElementId(null)}>
        {/* Editor Container */}
        <div className="bg-white rounded-b-xl shadow-sm border border-slate-200 border-t-0 p-8 min-h-[calc(100%-8px)]" onClick={(e) => e.stopPropagation()}>
          {/* Image Blocks Section */}
          <div className="border border-slate-200 rounded-lg p-6 relative">
            <h2 className="text-[#0c1b33] font-bold pb-4 border-b border-slate-100 text-[15px] mb-6 flex justify-between">
              Image Blocks
              <button className="text-slate-600 hover:text-slate-900 cursor-pointer" onClick={() => handleAction("Close Panel")}>
                 <X size={20} className="stroke-[2.5]" />
              </button>
            </h2>

            {/* Image Panel */}
            <h3 className="text-[#0c1b33] font-bold text-[14px] mb-4">Image Panel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Card 1 - Upload Generic */}
              <div className="bg-white rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-4 pb-5 flex flex-col items-center">
                <div 
                  className="w-full aspect-video bg-[#a5b4fc] bg-opacity-40 rounded-lg flex items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition"
                  onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }}
                >
                  <ImageIcon size={64} className="text-white" />
                </div>
                <p className="text-slate-600 text-[13px] mb-4 font-medium">Upload izze. Timraes</p>
                <div className="w-full relative">
                  {activeElementId === "btn-1" && <div className="absolute -inset-1.5 border-2 border-blue-500 rounded pointer-events-none" />}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveElementId("btn-1"); triggerFileUpload(); }}
                    className={`w-full py-2.5 bg-[#0c1b33] text-white text-[13px] font-medium transition-all duration-300 cursor-pointer ${getStyleClass(elements["btn-1"].buttonStyle)}`}
                    style={{ opacity: elements["btn-1"].opacity / 100 }}
                  >
                    {elements["btn-1"].label}
                  </button>
                </div>
              </div>

              {/* Card 2 - Mountain Image 1 */}
              <div className="bg-white rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-4 pb-5 flex flex-col items-center">
                <div 
                  className="w-full aspect-video rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-80 transition"
                  onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }}
                >
                   <img src={mountainSrc1} alt="Mountain view" className="w-full h-full object-cover" />
                </div>
                <p className="text-slate-600 text-[13px] mb-4 font-medium">Upload izze. Timraes</p>
                <div className="w-full relative">
                  {activeElementId === "btn-2" && <div className="absolute -inset-1.5 border-2 border-blue-500 rounded pointer-events-none" />}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveElementId("btn-2"); triggerFileUpload(); }}
                    className={`w-full py-2.5 bg-white text-slate-700 border border-slate-300 text-[13px] font-medium transition-all duration-300 hover:bg-slate-50 cursor-pointer ${getStyleClass(elements["btn-2"].buttonStyle)}`}
                    style={{ opacity: elements["btn-2"].opacity / 100 }}
                  >
                    {elements["btn-2"].label}
                  </button>
                </div>
              </div>

              {/* Card 3 - Mountain Image 2 */}
              <div className="bg-white rounded-lg shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-4 pb-5 flex flex-col items-center">
                <div 
                  className="w-full aspect-video rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-80 transition"
                  onClick={(e) => { e.stopPropagation(); triggerFileUpload(); }}
                >
                   <img src={mountainSrc2} alt="Mountain scenery" className="w-full h-full object-cover" />
                </div>
                <p className="text-slate-600 text-[13px] mb-4 font-medium">Upload izze. Timraes</p>
                <div className="w-full relative">
                  {activeElementId === "btn-3" && <div className="absolute -inset-1.5 border-2 border-blue-500 rounded pointer-events-none" />}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveElementId("btn-3"); triggerFileUpload(); }}
                    className={`w-full py-2.5 bg-white text-slate-700 border border-slate-300 text-[13px] font-medium transition-all duration-300 hover:bg-slate-50 cursor-pointer ${getStyleClass(elements["btn-3"].buttonStyle)}`}
                    style={{ opacity: elements["btn-3"].opacity / 100 }}
                  >
                    {elements["btn-3"].label}
                  </button>
                </div>
              </div>

            </div>

            {/* Image Gallery */}
            <h3 className="text-[#0c1b33] font-bold text-[14px] mb-4">Image Gallery</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border border-slate-200 rounded-lg p-6">
              
              {/* Gallery Format 1 */}
              <div 
                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition p-2 rounded hover:bg-slate-50"
                onClick={(e) => { e.stopPropagation(); handleAction("Edit Gallery Formatting"); }}
              >
                <div className="flex gap-2 w-full mb-4 h-32 pointer-events-none">
                  <div className="flex-[1] rounded-md overflow-hidden"><img src={mountainSrc1} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="flex-[1] rounded-md overflow-hidden"><img src={mountainSrc2} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="flex-[1] rounded-md overflow-hidden"><img src={mountainSrc1} className="w-full h-full object-cover" alt="mountains"/></div>
                </div>
                <p className="text-[#0c1b33] font-bold text-[14px]">Add Your Heading Here</p>
              </div>

              {/* Gallery Format 2 (6 smaller images with text skeleton) */}
              <div 
                className="flex flex-col w-full cursor-pointer hover:opacity-80 transition p-2 rounded hover:bg-slate-50"
                onClick={(e) => { e.stopPropagation(); handleAction("Edit Grid Formatting"); }}
              >
                <div className="grid grid-cols-6 gap-1.5 mb-6 h-[72px] pointer-events-none">
                  <div className="rounded-sm overflow-hidden"><img src={mountainSrc1} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="rounded-sm overflow-hidden"><img src={mountainSrc2} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="rounded-sm overflow-hidden"><img src={mountainSrc1} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="rounded-sm overflow-hidden"><img src={mountainSrc2} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="rounded-sm overflow-hidden"><img src={mountainSrc1} className="w-full h-full object-cover" alt="mountains"/></div>
                  <div className="rounded-sm overflow-hidden"><img src={mountainSrc2} className="w-full h-full object-cover" alt="mountains"/></div>
                </div>
                
                {/* Skeleton Text */}
                <div className="flex flex-col items-center gap-2 opacity-60 pointer-events-none">
                     <div className="h-1 bg-slate-300 rounded w-16 mb-2"></div>
                     <div className="h-2 bg-slate-300 rounded w-full"></div>
                     <div className="h-2 bg-slate-300 rounded w-[90%]"></div>
                     <div className="h-2 bg-slate-300 rounded w-[95%]"></div>
                     <div className="h-2 bg-slate-300 rounded w-[80%]"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
