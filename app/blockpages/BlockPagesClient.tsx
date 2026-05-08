"use client";

import { useState } from "react";
import ButtonCanvas from "./buttonblock/Canvas";
import ButtonRightSidebar from "./buttonblock/RightSidebar";
import type { BlockData } from "./buttonblock/types";
import { BuilderProvider } from "./imageblock/BuilderContext";
import LeftSidebar, { type BlockPageType } from "./imageblock/LeftSidebar";
import ImageMainCanvas from "./imageblock/MainCanvas";
import ImageRightSidebar from "./imageblock/RightSidebar";

const initialButtonBlock: BlockData = {
  id: "button-default",
  type: "button",
  props: {
    width: "600 px",
    borderRadius: "18 px",
  },
};

export default function BlockPagesClient() {
  const [activeBlockPage, setActiveBlockPage] = useState<BlockPageType>("image");
  const [buttonBlocks, setButtonBlocks] = useState<BlockData[]>([initialButtonBlock]);
  const [selectedButtonBlockId, setSelectedButtonBlockId] = useState<string | null>(initialButtonBlock.id);
  const [pastButtonStates, setPastButtonStates] = useState<BlockData[][]>([]);
  const [futureButtonStates, setFutureButtonStates] = useState<BlockData[][]>([]);

  const pushButtonState = (nextBlocks: BlockData[]) => {
    setPastButtonStates((current) => [...current, buttonBlocks]);
    setFutureButtonStates([]);
    setButtonBlocks(nextBlocks);
  };

  const undoButton = () => {
    setPastButtonStates((currentPast) => {
      if (currentPast.length === 0) {
        return currentPast;
      }

      const previous = currentPast[currentPast.length - 1];
      setFutureButtonStates((currentFuture) => [buttonBlocks, ...currentFuture]);
      setButtonBlocks(previous);
      setSelectedButtonBlockId(previous[0]?.id ?? null);
      return currentPast.slice(0, -1);
    });
  };

  const redoButton = () => {
    setFutureButtonStates((currentFuture) => {
      if (currentFuture.length === 0) {
        return currentFuture;
      }

      const [next, ...remaining] = currentFuture;
      setPastButtonStates((currentPast) => [...currentPast, buttonBlocks]);
      setButtonBlocks(next);
      setSelectedButtonBlockId(next[0]?.id ?? null);
      return remaining;
    });
  };

  const updateButtonBlock = (id: string, props: Record<string, unknown>) => {
    if (!id) {
      return;
    }

    pushButtonState(
      buttonBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              props: {
                ...block.props,
                ...props,
              },
            }
          : block,
      ),
    );
  };

  const removeButtonBlock = (id: string) => {
    const nextBlocks = buttonBlocks.filter((block) => block.id !== id);
    pushButtonState(nextBlocks);
    setSelectedButtonBlockId(nextBlocks[0]?.id ?? null);
  };

  const selectedButtonBlock =
    buttonBlocks.find((block) => block.id === selectedButtonBlockId) ?? buttonBlocks[0] ?? null;

  return (
    <BuilderProvider>
      <section className="flex min-h-[calc(100vh-64px)] flex-1 gap-4 overflow-hidden bg-[#e9eef6] p-4">
        <div className="contents lg:block lg:overflow-hidden lg:rounded-xl lg:shadow-[0_18px_45px_rgba(11,29,64,0.12)]">
          <LeftSidebar activeBlockPage={activeBlockPage} onSelectBlockPage={setActiveBlockPage} />
        </div>

        {activeBlockPage === "button" ? (
          <div className="flex min-w-0 flex-1 gap-4">
            <ButtonCanvas
              blocks={buttonBlocks}
              selectedBlockId={selectedButtonBlockId}
              onSelectBlock={setSelectedButtonBlockId}
              onRemoveBlock={removeButtonBlock}
              canUndo={pastButtonStates.length > 0}
              canRedo={futureButtonStates.length > 0}
              onUndo={undoButton}
              onRedo={redoButton}
            />
            <div className="hidden lg:block">
              <ButtonRightSidebar selectedBlock={selectedButtonBlock} onUpdateBlock={updateButtonBlock} />
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 gap-4">
            <ImageMainCanvas />
            <ImageRightSidebar />
          </div>
        )}
      </section>
    </BuilderProvider>
  );
}
