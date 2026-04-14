"use client";

export function BackgroundDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 top-[57px] z-0 overflow-hidden motion-reduce:hidden"
    >
      {/* Warm amber glow — top left */}
      <div className="absolute -top-10 -left-10 h-[550px] w-[550px] rounded-full bg-[#ffcc66] opacity-[0.25] blur-[100px] animate-blob-drift" />

      {/* Soft peach glow — bottom right */}
      <div className="absolute bottom-0 -right-10 h-[500px] w-[500px] rounded-full bg-[#ffd6a0] opacity-[0.22] blur-[90px] animate-blob-drift-reverse" />

      {/* Light gold glow — center, slow wander */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-[#ffe580] opacity-[0.18] blur-[100px] animate-blob-drift-slow" />

      {/* Gentle tangerine accent — top right area */}
      <div className="absolute top-16 right-10 h-[350px] w-[350px] rounded-full bg-[#ffb870] opacity-[0.18] blur-[80px] animate-blob-drift-reverse" />

      {/* Soft vertical wave glows — ambient side accents */}
      <div className="absolute -left-12 top-[10%] h-[70vh] w-[120px] rounded-full bg-[#ffcc80] opacity-[0.12] blur-[80px] animate-wave-drift" />
      <div className="absolute -right-10 top-[20%] h-[65vh] w-[100px] rounded-full bg-[#ffd6a0] opacity-[0.10] blur-[90px] animate-wave-drift-reverse" />
      <div className="absolute left-[15%] top-[30%] h-[55vh] w-[80px] rounded-full bg-[#ffe0b0] opacity-[0.08] blur-[100px] animate-wave-drift-slow" />
      <div className="absolute right-[18%] top-[5%] h-[60vh] w-[90px] rounded-full bg-[#ffcc66] opacity-[0.07] blur-[110px] animate-wave-drift" />
    </div>
  );
}
