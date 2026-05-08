"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import MobileLeftSidebar from '../components/MobileLeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Canvas from '../components/Canvas';
import Footer from '../components/Footer';
import { BlockData, BlockType } from '../types';

export default function Page() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Mobile Responsiveness Sidebars
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  
  // History tracking
  const [pastStates, setPastStates] = useState<BlockData[][]>([]);
  const [futureStates, setFutureStates] = useState<BlockData[][]>([]);

  const pushState = (newBlocks: BlockData[]) => {
    setPastStates([...pastStates, blocks]);
    setFutureStates([]);
    setBlocks(newBlocks);
  };

  const undo = () => {
    if (pastStates.length === 0) return;
    const previous = pastStates[pastStates.length - 1];
    setFutureStates([blocks, ...futureStates]);
    setPastStates(pastStates.slice(0, pastStates.length - 1));
    setBlocks(previous);
  };

  const redo = () => {
    if (futureStates.length === 0) return;
    const next = futureStates[0];
    setPastStates([...pastStates, blocks]);
    setFutureStates(futureStates.slice(1));
    setBlocks(next);
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: BlockData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      props: {
        width: '600 px',
        borderRadius: '18 px'
      }
    };
    pushState([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleRemoveBlock = (id: string) => {
    pushState(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleUpdateBlock = (id: string, newProps: Record<string, unknown>) => {
    pushState(blocks.map(b => 
      b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b
    ));
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#F0F2F5] font-sans">
      <Header />
      <div className="flex flex-1 h-[calc(100vh-80px)] flex-shrink-0 relative w-full overflow-hidden">
        
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden lg:flex lg:relative lg:translate-x-0 inset-y-0 left-0 bg-[#0B1D40]">
          <LeftSidebar onAddBlock={(type) => { handleAddBlock(type); }} />
        </div>

        {/* Mobile Left Sidebar Overlay (Bottom Sheet) */}
        <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isLeftOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsLeftOpen(false)}></div>
          <div className={`absolute bottom-0 left-0 w-full h-[65vh] max-h-[800px] bg-[#0A193A] rounded-t-3xl transform transition-transform duration-300 ${isLeftOpen ? 'translate-y-0' : 'translate-y-full'} overflow-hidden flex flex-col shadow-2xl`}>
            <MobileLeftSidebar onAddBlock={(type) => { handleAddBlock(type); setIsLeftOpen(false); }} onClose={() => setIsLeftOpen(false)} />
          </div>
        </div>
        
        <Canvas 
          blocks={blocks} 
          selectedBlockId={selectedBlockId} 
          onSelectBlock={setSelectedBlockId}
          onRemoveBlock={handleRemoveBlock}
          canUndo={pastStates.length > 0}
          canRedo={futureStates.length > 0}
          onUndo={undo}
          onRedo={redo}
          onToggleLeft={() => setIsLeftOpen(!isLeftOpen)}
          onToggleRight={() => setIsRightOpen(!isRightOpen)}
        />
        
        {/* Right Sidebar (Desktop Only) */}
        <div className="hidden xl:flex xl:relative xl:translate-x-0 inset-y-0 right-0 h-full bg-[#FFF3F0] transition-transform duration-300">
          <RightSidebar 
            selectedBlock={blocks.find(b => b.id === selectedBlockId) || null} 
            onUpdateBlock={handleUpdateBlock}
            onClose={() => setIsRightOpen(false)}
          />
        </div>

        {/* Mobile Right Sidebar Overlay */}
        <div className={`fixed inset-0 z-50 xl:hidden transition-opacity duration-300 ${isRightOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsRightOpen(false)}></div>
          <div className={`absolute top-0 right-0 h-full w-[300px] sm:w-[350px] bg-[#FFF3F0] transform transition-transform duration-300 ${isRightOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <RightSidebar 
              selectedBlock={blocks.find(b => b.id === selectedBlockId) || null} 
              onUpdateBlock={handleUpdateBlock}
              onClose={() => setIsRightOpen(false)}
            />
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
}
