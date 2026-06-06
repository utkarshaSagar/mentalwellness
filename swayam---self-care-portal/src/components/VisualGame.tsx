/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Shield, RefreshCw, Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';

interface ColorBubble {
  id: number;
  color: string;
  matched: boolean;
  active: boolean;
}

const HARMONY_COLORS = [
  '#E6DCD2', // Warm Sand
  '#C5D3C1', // Sage Soft
  '#BACCD9', // Sky Soft
  '#D7C0CD', // Lavender Soft
  '#EED3C4', // Peach Soft
  '#D1D1D1', // Soft Silver
];

export const VisualGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'orbit' | 'harmony'>('orbit');
  
  // Infinity Orbit Tracking state
  const [isPlayingOrbit, setIsPlayingOrbit] = useState(false);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(0.013); // calm pace
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  // Color Harmony State
  const [board, setBoard] = useState<ColorBubble[]>([]);
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [gentleSounds, setGentleSounds] = useState<boolean>(false);
  const [harmonyPuzzlesSolved, setHarmonyPuzzlesSolved] = useState<number>(0);

  // Start/Stop Infinity Tracker
  useEffect(() => {
    if (gameMode !== 'orbit' || !isPlayingOrbit) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 300;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic animation loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Calculate figure-8 (Lemniscate of Bernoulli)
      // x = a * cos(t) / (1 + sin^2(t))
      // y = a * sin(t) * cos(t) / (1 + sin^2(t))
      const scaleFactor = Math.min(width * 0.4, 140);
      const t = angleRef.current;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const targetX = centerX + (scaleFactor * Math.cos(t)) / denom;
      const targetY = centerY + (scaleFactor * Math.sin(t) * Math.cos(t)) / denom;

      // Draw thin, comforting guide line path
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(214, 206, 196, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 8]);
      
      for (let s = 0; s < Math.PI * 2; s += 0.05) {
        const d = 1 + Math.sin(s) * Math.sin(s);
        const px = centerX + (scaleFactor * Math.cos(s)) / d;
        const py = centerY + (scaleFactor * Math.sin(s) * Math.cos(s)) / d;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Draw central calm beacon
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#A3998E';
      ctx.fill();

      // Draw moving therapeutic breathing glow orbit
      const pulseSize = 14 + Math.sin(t * 3) * 3;
      
      // Outer aura glow
      const grad = ctx.createRadialGradient(targetX, targetY, 2, targetX, targetY, pulseSize * 2.5);
      grad.addColorStop(0, 'rgba(153, 194, 185, 0.65)'); // soft green-teal
      grad.addColorStop(0.5, 'rgba(186, 204, 217, 0.3)'); // sky soft
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(targetX, targetY, pulseSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Inner physical core tracker
      ctx.beginPath();
      ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#5A756E'; // warm teal-slate
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.fill();
      ctx.stroke();

      // Update position angle
      angleRef.current += orbitSpeed;
      if (angleRef.current > Math.PI * 2) {
        angleRef.current -= Math.PI * 2;
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameMode, isPlayingOrbit, orbitSpeed]);

  // Generate a random pair-matched harmony deck (12 items for 3x4 grid)
  const initHarmonyGame = () => {
    const rawList: string[] = [];
    // 6 colors duplicated once = 12 items
    for (let i = 0; i < 6; i++) {
      rawList.push(HARMONY_COLORS[i]);
      rawList.push(HARMONY_COLORS[i]);
    }
    // Shuffle
    const shuffled = rawList
      .map((color, idx) => ({ id: idx, color, matched: false, active: false }))
      .sort(() => Math.random() - 0.5);
    
    setBoard(shuffled);
    setSelectedIdxs([]);
  };

  useEffect(() => {
    if (gameMode === 'harmony') {
      initHarmonyGame();
    }
  }, [gameMode]);

  const handleTileClick = (index: number) => {
    const current = board[index];
    if (current.matched || current.active || selectedIdxs.length >= 2) return;

    // Set selected active state
    const updated = [...board];
    updated[index].active = true;
    setBoard(updated);

    const nextSelected = [...selectedIdxs, index];
    setSelectedIdxs(nextSelected);

    if (nextSelected.length === 2) {
      const first = board[nextSelected[0]];
      const second = board[nextSelected[1]];

      if (first.color === second.color) {
        // MATCHED!
        setTimeout(() => {
          const finalBoard = [...board];
          finalBoard[nextSelected[0]].matched = true;
          finalBoard[nextSelected[1]].matched = true;
          finalBoard[nextSelected[0]].active = false;
          finalBoard[nextSelected[1]].active = false;
          setBoard(finalBoard);
          setSelectedIdxs([]);

          // Sound effect trigger (pure visual/vibration simulation cue)
          if (gentleSounds && 'vibrate' in navigator) {
            navigator.vibrate(15);
          }

          // Check Win Condition
          const allMatched = finalBoard.every(tile => tile.matched);
          if (allMatched) {
            setHarmonyPuzzlesSolved(prev => prev + 1);
          }
        }, 500);
      } else {
        // MISMATCHED - Flip back
        setTimeout(() => {
          const resetBoard = [...board];
          resetBoard[nextSelected[0]].active = false;
          resetBoard[nextSelected[1]].active = false;
          setBoard(resetBoard);
          setSelectedIdxs([]);
        }, 800);
      }
    }
  };

  return (
    <div id="visual-relaxation-root" className="bg-white border border-stone-100 rounded-3xl p-6 shadow-md shadow-stone-100/50">
      
      {/* Header and Mode Selector */}
      <div id="visual-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-stone-50">
        <div className="flex items-center space-x-2.5 mb-3 sm:mb-0">
          <div className="p-2 bg-stone-50 rounded-xl text-stone-750">
            <Eye className="w-5 h-5 text-teal-600 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-stone-900 text-base md:text-lg">
              Drishti • Eye-Relax Oasis
            </h3>
            <p className="text-[11px] text-stone-400">Eye-strain release built for micro-study breaks.</p>
          </div>
        </div>

        <div className="bg-stone-50 p-1 rounded-xl flex items-center space-x-1">
          <button
            id="btn-switch-mode-orbit"
            onClick={() => { setGameMode('orbit'); setIsPlayingOrbit(false); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              gameMode === 'orbit'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Infinity Orbit
          </button>
          <button
            id="btn-switch-mode-harmony"
            onClick={() => setGameMode('harmony')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              gameMode === 'harmony'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Harmony Zen Matching
          </button>
        </div>
      </div>

      {/* RENDER MODE 1: OPTICAL INFINITY ORBIT TRACKER */}
      {gameMode === 'orbit' && (
        <div id="orbit-mode-workspace" className="space-y-4">
          <div className="p-4 bg-teal-50/45 rounded-2xl border border-teal-100 text-left">
            <div className="flex items-center space-x-2 text-teal-900 font-semibold text-xs mb-1">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Ophthalmic Relax Guide:</span>
            </div>
            <p className="text-[11px] text-teal-800 leading-normal">
              Keep your head completely static. Stare closely at the moving green orb as it glides along the infinity loop. Following its continuous flow stretches tired focal muscles, resets physical blinking cycles, and lubricates dry eyes from intense reading.
            </p>
          </div>

          <div className="relative border border-stone-150/60 rounded-2xl bg-stone-50/50 flex flex-col justify-center items-center overflow-hidden py-4 min-h-[300px]">
            {!isPlayingOrbit ? (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 space-y-4 z-10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-teal-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-800 block">Ready to Release Near-Focus Muscle Lock?</span>
                  <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
                    Stare strictly at the center dot and follow the orbiting focus bubble with your eyes. We recommend 60 seconds.
                  </p>
                </div>
                <button
                  id="btn-start-orbit-tracker"
                  onClick={() => setIsPlayingOrbit(true)}
                  className="bg-stone-900 hover:bg-stone-800 px-5 py-2.5 rounded-xl text-stone-50 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Start Eye-Tracking Focus
                </button>
              </div>
            ) : null}

            <canvas ref={canvasRef} className="w-full h-[300px] z-0" />

            {/* Speeds selector */}
            {isPlayingOrbit && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 border border-stone-200 shadow-sm rounded-full flex items-center space-x-3 text-[10px] font-semibold text-stone-500">
                <span>Speed:</span>
                <div className="flex items-center space-x-1">
                  {( [
                    { label: 'Idle Breeze', val: 0.007 },
                    { label: 'Calm Pace', val: 0.013 },
                    { label: 'Active Gym', val: 0.022 }
                  ] as const).map(speed => (
                    <button
                      id={`btn-orbit-speed-${speed.val}`}
                      key={speed.val}
                      onClick={() => setOrbitSpeed(speed.val)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition ${orbitSpeed === speed.val ? 'font-bold' : 'hover:bg-stone-150 hover:text-stone-950'}`}
                      style={{
                        backgroundColor: orbitSpeed === speed.val ? '#1c1917' : 'transparent',
                        color: orbitSpeed === speed.val ? '#ffffff' : '#57534e'
                      }}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
                <div className="h-3 w-[1px] bg-stone-200" />
                <button
                  id="btn-stop-orbit-tracker"
                  onClick={() => setIsPlayingOrbit(false)}
                  className="text-stone-700 hover:text-rose-600 uppercase font-mono font-bold tracking-wider"
                >
                  Pause
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER MODE 2: COLOR HARMONY ZEN MATCHING */}
      {gameMode === 'harmony' && (
        <div id="harmony-mode-workspace" className="space-y-4">
          <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-100 flex items-center justify-between text-left text-xs gap-4">
            <div>
              <span className="font-semibold text-stone-800 block mb-0.5">Warm Pastel Matching Game</span>
              <p className="text-[11px] text-stone-500 leading-normal max-w-md">
                Decompress from intense syllabus revisions by slowly matching identical soothing colors. Enjoy the pastel hues designed to give your optic receptors a smooth wavelength transition.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0">
              <button
                id="btn-toggle-harmony-sounds"
                onClick={() => setGentleSounds(!gentleSounds)}
                className={`p-2 rounded-xl border transition ${gentleSounds ? 'bg-stone-900 border-stone-900 text-teal-400' : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600'}`}
                title="Toggle gentle feedback cue"
              >
                {gentleSounds ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                id="btn-refresh-harmony-puzzle"
                onClick={initHarmonyGame}
                className="p-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-800 rounded-xl transition"
                title="Generate fresh puzzle card"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto py-4">
            {board.map((tile, idx) => {
              const showColor = tile.active || tile.matched;
              return (
                <button
                  id={`harmony-tile-idx-${idx}`}
                  key={tile.id}
                  onClick={() => handleTileClick(idx)}
                  disabled={tile.matched}
                  className="aspect-square rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                  style={{
                    backgroundColor: showColor ? tile.color : '#FCFBF9',
                    borderColor: tile.active 
                      ? '#7C7165' 
                      : tile.matched 
                        ? 'transparent' 
                        : 'rgba(214, 206, 196, 0.45)',
                    opacity: tile.matched ? 0.35 : 1
                  }}
                >
                  {!showColor && (
                    <div className="w-2.5 h-2.5 bg-stone-300/60 rounded-full" />
                  )}
                  {tile.matched && (
                    <div className="w-2 h-2 bg-stone-800 rounded-full animate-ping absolute" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Winning counter */}
          {harmonyPuzzlesSolved > 0 && (
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl w-fit mx-auto font-semibold">
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Beautifully solved: {harmonyPuzzlesSolved} round{harmonyPuzzlesSolved > 1 ? 's' : ''} of soft color match</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
