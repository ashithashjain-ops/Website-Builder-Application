"use client";
 
import React, { useState } from 'react';
import { FaXmark, FaArrowRight, FaWandMagicSparkles, FaImage, FaPlay } from "react-icons/fa6";
 
const CreateProjectModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    category: '',
    template: ''
  });
  const [error, setError] = useState('');
 
  if (!isOpen) return null;
 
  // Validation: Only allow Alphanumeric and Spaces
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9 ]*$/;
 
    if (regex.test(value)) {
      setProjectData({ ...projectData, name: value });
      setError('');
    } else {
      setError('Please use only letters and numbers.');
    }
  };
 
  const handleNext = () => {
    if (step === 1 && !projectData.name.trim()) {
      setError('Project name is required.');
      return;
    }
    setStep((s) => s + 1);
  };
 
  const handleBack = () => setStep((s) => s - 1);
 
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#06224C]/80 backdrop-blur-sm" onClick={onClose}></div>
 
      {/* Modal Card - Width is 95% of viewport to handle high zoom */}
      <div className="relative w-full max-w-[95vw] sm:max-w-2xl bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
       
        {/* Header - Flexible for large text */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50 gap-4">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black text-[#06224C] uppercase tracking-widest break-words">
              Create Project
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex-shrink-0">
            <FaXmark />
          </button>
        </div>
 
        {/* Content Area - min-h-0 allows internal scrolling on high zoom */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-grow min-h-0">
         
          {/* STEP 1: Name Validation */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-black text-[#06224C] leading-tight break-words">Your Project Name.</h4>
                {/* <p className="text-xs sm:text-sm text-gray-500 font-medium">Letters and numbers only.</p> */}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="projectName"
                  placeholder="e.g. MyProject01"
                  className={`w-full border-2 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg outline-none transition-all font-bold ${error ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'}`}
                  value={projectData.name}
                  onChange={handleNameChange}
                />
                {error && (
                  <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wide animate-pulse">
                    <i className="fa-solid fa-circle-exclamation mr-1"></i> {error}
                  </p>
                )}
              </div>
            </div>
          )}
 
          {/* STEP 2: Category */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xl sm:text-2xl font-black text-[#06224C] break-words">What are you building?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {['E-commerce', 'Portfolio', 'Blog', 'Business'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectData({...projectData, category: cat})}
                    className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${projectData.category === cat ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                  >
                    <p className="font-black text-sm sm:text-base text-[#06224C]">{cat}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Select category</p>
                  </button>
                ))}
              </div>
            </div>
          )}
 
          {/* STEP 3: Template */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-xl sm:text-2xl font-black text-[#06224C] break-words">Pick a starting point.</h4>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    onClick={() => setProjectData({...projectData, template: `style-${i}`})}
                    className={`group cursor-pointer space-y-2 p-2 rounded-xl sm:rounded-2xl border-2 transition-all ${projectData.template === `style-${i}` ? 'border-blue-500 bg-blue-50/30' : 'border-transparent'}`}
                  >
                    <div className="aspect-video bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center text-gray-300">
                      <FaImage className="text-2xl sm:text-3xl" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-black text-center text-[#06224C]">Style {i}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
 
        {/* Footer Actions - Uses flex-wrap for high zoom */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
          <button
            onClick={handleBack}
            className={`px-4 py-2 sm:px-8 sm:py-3 font-black text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 hover:text-[#06224C] transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            Back
          </button>
         
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!!error || !projectData.name}
              className="bg-[#06224C] text-white px-6 py-2 sm:px-10 sm:py-3 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-blue-900 transition-all disabled:opacity-50 shadow-lg whitespace-nowrap"
            >
              Continue <FaArrowRight className="inline ml-1" />
            </button>
          ) : (
            <button
              onClick={() => {
                alert(`Success! Project "${projectData.name}" created.`);
                onClose();
                setStep(1);
                setProjectData({ name: '', category: '', template: '' });
              }}
              disabled={!projectData.template}
              className="bg-green-600 text-white px-6 py-2 sm:px-10 sm:py-3 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 whitespace-nowrap"
            >
              Build <FaWandMagicSparkles className="inline ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default function CreateProjectFlow() {
  const [isOpen, setIsOpen] = useState(false);
 
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#0A2357] px-8 py-4 font-bold text-white shadow-xl transition hover:scale-105 active:scale-95"
      >
        Get Started
        <span className="rounded-full bg-white p-1 text-[10px] text-[#0A2357]">
          <FaPlay />
        </span>
      </button>
 
      <CreateProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}