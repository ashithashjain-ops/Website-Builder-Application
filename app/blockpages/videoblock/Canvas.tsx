import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Undo2, Redo2, Eye, Send, X, Save, Edit, Copy, Trash2, Play } from 'lucide-react';
import { VideoBlockData } from './types';
 
interface CanvasProps {
  blocks: VideoBlockData[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onRemoveBlock: (id: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenMobileSidebar?: () => void;
  onApplyVideo?: () => void;
}
 
export default function Canvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onRemoveBlock,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenMobileSidebar,
  onApplyVideo
}: CanvasProps) {
  const router = useRouter();
 
  const handleApply = (e: React.MouseEvent, block: VideoBlockData) => {
    e.stopPropagation();
    localStorage.setItem('portfolioVideoData', JSON.stringify(block.props));
    if (onApplyVideo) {
      onApplyVideo();
    } else {
      router.push('/blockpages?template=portfolio');
    }
  };
 
  const renderBlockContent = (block: VideoBlockData) => {
    const { sourceType, uploadUrl, embedCode, posterImage, autoplay, loop, muted, showControls } = block.props;
 
    return (
      <div className="w-full relative bg-gray-100 rounded-[20px] overflow-hidden aspect-video group">
        {sourceType === 'upload' ? (
          uploadUrl ? (
            <video
              src={uploadUrl}
              poster={posterImage}
              autoPlay={autoplay}
              loop={loop}
              muted={muted}
              controls={showControls}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200">
              <Play className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium text-sm">No video uploaded</p>
              <p className="text-xs opacity-70 mt-1">Select "Upload Video" in the sidebar</p>
            </div>
          )
        ) : (
          embedCode ? (
            <div className="w-full h-full flex items-center justify-center bg-black" dangerouslySetInnerHTML={{ __html: embedCode }} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200">
              <Play className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium text-sm">No embed code provided</p>
              <p className="text-xs opacity-70 mt-1">Paste iframe code in the sidebar</p>
            </div>
          )
        )}
      </div>
    );
  };
 
  return (
    <main
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#dbe3ef] bg-[#f7f9fc] shadow-sm"
      onClick={() => onSelectBlock(null)} // Click outside to deselect
    >
      {/* Top Actions Bar */}
      <div
        className="flex h-[64px] flex-shrink-0 items-center justify-between gap-4 overflow-x-auto border-b border-[#dbe3ef] bg-white px-3 shadow-[0_1px_0_rgba(15,23,42,0.03)] md:px-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 whitespace-nowrap rounded px-2 py-1.5 text-[14px] font-bold text-[#0B1D40] hover:bg-gray-100 md:text-[15px] cursor-pointer">
          My Website
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
 
        {/* Mobile Settings Trigger */}
        <button
          className="xl:hidden ml-auto mr-2 flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#0f3b89] px-3 py-2 text-[13px] font-bold text-white shadow-sm hover:bg-[#0c2e6b]"
          onClick={() => onOpenMobileSidebar?.()}
        >
          Edit Styles
        </button>
 
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-shrink-0 overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
            <button
              className={`border-r border-gray-300 px-3 py-2 ${canUndo ? 'text-gray-600 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
            >
              <Undo2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <button
              className={`px-3 py-2 ${canRedo ? 'text-gray-600 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo"
            >
              <Redo2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          </div>
 
          <button
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] font-bold text-[#0B1D40] shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => alert("Draft saved locally!")}
            title="Save Draft"
          >
            <Save className="h-4 w-4 text-gray-600 xl:hidden" />
            <span className="hidden xl:inline">Save Draft</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] font-bold text-[#0B1D40] shadow-sm hover:bg-gray-50 transition-colors"
            onClick={() => alert("Preview mode not yet implemented.")}
            title="Preview"
          >
            <Eye className="h-4 w-4 text-gray-600" />
            <span className="hidden xl:inline">Preview</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#0B1D40] px-5 py-2 text-[13px] font-bold text-white shadow-[0_2px_4px_rgba(11,29,64,0.3)] hover:bg-[#152B52] transition-colors"
            onClick={() => alert("Publish sequence initiated!")}
            title="Publish"
          >
            <span className="hidden xl:inline">Publish</span>
            <Send className="h-[14px] w-[14px] ml-1" />
          </button>
        </div>
      </div>
 
      {/* Canvas Fixed Area */}
      <div className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 py-6 sm:px-6 xl:px-8 bg-gray-50">
        {blocks.map(block => {
          const isSelected = selectedBlockId === block.id;
 
          return (
            <div
              key={block.id}
              className={`flex max-h-full w-full max-w-[900px] cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-[0_18px_45px_rgba(15,35,75,0.08)] transition ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-[#dbe3ef] hover:border-blue-300'}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBlock(block.id);
                onOpenMobileSidebar?.();
              }}
            >
              {/* Canvas Header */}
              <div className="flex items-center justify-between border-b border-[#e6edf5] bg-white px-5 py-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-[#0B1D40] font-bold text-[16px] capitalize">Video Blocks</h2>
                  <button
                    onClick={(e) => handleApply(e, block)}
                    className="bg-[#0f3b89] hover:bg-[#0c2e6b] text-white px-3 py-1 text-sm font-bold rounded shadow-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
 
                <div className="flex items-center gap-2">
                  <button className="text-gray-500 hover:text-[#0B1D40] hover:bg-gray-100 p-1.5 rounded transition-colors" title="Edit">
                    <Edit className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button className="text-gray-500 hover:text-[#0B1D40] hover:bg-gray-100 p-1.5 rounded transition-colors" title="Duplicate">
                    <Copy className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button className="text-gray-500 hover:text-[#0B1D40] hover:bg-gray-100 p-1.5 rounded transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                  <button
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBlock(block.id);
                    }}
                    title="Close"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
 
              {/* Block Content Region */}
              <div className="relative flex w-full flex-1 flex-col items-start overflow-y-auto p-5 sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {renderBlockContent(block)}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}