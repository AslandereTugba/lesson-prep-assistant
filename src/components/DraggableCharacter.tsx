"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

export function DraggableCharacter() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const elRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - currentOffset.current.x,
        y: e.clientY - currentOffset.current.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const x = e.clientX - dragStart.current.x;
      const y = e.clientY - dragStart.current.y;
      currentOffset.current = { x, y };
      setOffset({ x, y });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    currentOffset.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
  }, []);

  // Clean up if pointer leaves window while dragging
  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalUp = () => {
      setIsDragging(false);
      currentOffset.current = { x: 0, y: 0 };
      setOffset({ x: 0, y: 0 });
    };
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, [isDragging]);

  return (
    <div className="flex justify-center pt-4">
      <div
        ref={elRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="select-none touch-none relative"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.15}deg)`,
          transition: isDragging
            ? "none"
            : "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s 0.6s",
          cursor: isDragging ? "grabbing" : "grab",
          willChange: isDragging ? "transform" : "auto",
          zIndex: isDragging ? 9999 : 1,
        }}
      >
        <Image
          src="/icons/assistant-character.png"
          alt=""
          width={120}
          height={120}
          className="object-contain opacity-85 drop-shadow-sm pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
