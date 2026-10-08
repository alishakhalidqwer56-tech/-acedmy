import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  Monitor, 
  Download, 
  Share2, 
  Check, 
  Trophy, 
  GraduationCap, 
  Star, 
  PhoneCall, 
  MessageCircle, 
  Globe
} from 'lucide-react';
import { celebrationAudio } from '../../lib/celebrationAudio';
import { 
  CELEBRATION_STATS, 
  TOP_STUDENTS, 
  CELEBRATION_IMAGES, 
  CELEBRATION_FALLBACK_IMAGES,
  CELEBRATION_PROGRAMS, 
  ACADEMY_CONTACT 
} from '../../data/celebrationData';

interface CelebrationVideoPlayerProps {
  initialAspectRatio?: '16:9' | '9:16';
  autoPlay?: boolean;
}

export const CelebrationVideoPlayer: React.FC<CelebrationVideoPlayerProps> = ({
  initialAspectRatio = '16:9',
  autoPlay = false
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(initialAspectRatio);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [activeSpeed, setActiveSpeed] = useState<number>(1.0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const TOTAL_DURATION = 60.0;

  // Particle simulation state
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    color: string;
    opacity: number;
    rotation: number;
    rotSpeed: number;
    shape: 'circle' | 'rect' | 'star';
  }>>([]);

  // Initialize background confetti & gold dust
  useEffect(() => {
    const particles = [];
    const colors = ['#f59e0b', '#fef08a', '#d97706', '#ec4899', '#a855f7', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 1.4 + 0.6,
        speedX: (Math.random() - 0.5) * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 3,
        shape: (['circle', 'rect', 'star'] as const)[Math.floor(Math.random() * 3)],
      });
    }
    particlesRef.current = particles;
  }, []);

  // Sync audio with play/pause and time
  useEffect(() => {
    celebrationAudio.setVolume(volume);
  }, [volume]);

  // Main playback tick loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimestampRef.current = null;
      celebrationAudio.stopAll();
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = ((timestamp - lastTimestampRef.current) / 1000) * activeSpeed;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          celebrationAudio.stopAll();
          if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          return TOTAL_DURATION;
        }
        celebrationAudio.syncPlaybackTime(next, true);
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, activeSpeed, isRecording]);

  // Autoplay handler
  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // Canvas rendering for particles & visual effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderCanvas = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Only show particles from Scene 2 onward (0:05 to 1:00)
      if (currentTime >= 4.0) {
        // Draw falling gold/purple confetti
        particlesRef.current.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotSpeed;

          if (p.y > h) {
            p.y = -10;
            p.x = Math.random() * w;
          }
          if (p.x > w) p.x = 0;
          if (p.x < 0) p.x = w;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size * 1.5, p.size * 0.8);
          } else if (p.shape === 'star') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(-p.size, -0.5, p.size * 2, 1);
            ctx.strokeRect(-0.5, -p.size, 1, p.size * 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        // Ambient glow orbs
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.8, 10, w * 0.5, h * 0.8, w * 0.6);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
        grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Starburst effect during Scene 2 (First Position 11s - 15s)
      if (currentTime >= 11.0 && currentTime <= 14.5) {
        const progress = (currentTime - 11.0) / 3.5;
        const centerX = w * 0.5;
        const centerY = h * 0.45;
        const radius = 60 + progress * 240;

        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - progress * 1.2);
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI * 2) / 16 + progress * 2;
          const x1 = centerX + Math.cos(angle) * (radius * 0.3);
          const y1 = centerY + Math.sin(angle) * (radius * 0.3);
          const x2 = centerX + Math.cos(angle) * radius;
          const y2 = centerY + Math.sin(angle) * radius;

          const beamGrad = ctx.createLinearGradient(x1, y1, x2, y2);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.strokeStyle = beamGrad;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentTime]);

  const handlePlay = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
    }
    celebrationAudio.syncPlaybackTime(currentTime, true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    celebrationAudio.stopAll();
  };

  const handleRestart = () => {
    celebrationAudio.stopAll();
    setCurrentTime(0);
    setIsPlaying(true);
    celebrationAudio.syncPlaybackTime(0, true);
  };

  const handleSeek = (newSec: number) => {
    celebrationAudio.stopAll();
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, newSec));
    setCurrentTime(clamped);
    celebrationAudio.syncPlaybackTime(clamped, isPlaying);
  };

  const handleToggleMute = () => {
    const muted = celebrationAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    celebrationAudio.setVolume(val);
    if (isMuted && val > 0) {
      celebrationAudio.toggleMute();
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 *Girls Academy Islamabad — BISE Board Results 2025* 🏆\n\n` +
      `Celebrating Historic Academic Excellence:\n` +
      `✨ 95% Overall Pass Rate\n` +
      `⭐ 42 A+ Distinction Grades\n` +
      `🥇 1st Position in Islamabad District (Fatima Zahra: 1,096/1,100 Marks)\n` +
      `🔬 100% Matric Science Passing Rate\n\n` +
      `Admissions Open for Academic Session 2026-2027!\n` +
      `Watch the celebration film and connect with us:\n` +
      `📞 Phone: 051-4861234 | 💬 WhatsApp: 0300-4861234\n` +
      `${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDownloadVideo = () => {
    if (isRecording) return;
    setIsRecording(true);
    handleRestart();

    try {
      const canvas = canvasRef.current;
      if (canvas && typeof canvas.captureStream === 'function') {
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recordedChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `GirlsAcademy-BISE-Results-2025-${aspectRatio.replace(':', 'x')}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsRecording(false);
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
      } else {
        setTimeout(() => setIsRecording(false), 5000);
      }
    } catch {
      setIsRecording(false);
    }
  };

  const getSceneIndex = () => {
    if (currentTime < 5.0) return 1;
    if (currentTime < 18.0) return 2;
    if (currentTime < 32.0) return 3;
    if (currentTime < 45.0) return 4;
    return 5;
  };

  const currentScene = getSceneIndex();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnimatedCounter = (target: number, startSec: number, endSec: number) => {
    if (currentTime < startSec) return 0;
    if (currentTime >= endSec) return target;
    const progress = (currentTime - startSec) / (endSec - startSec);
    const ease = 1 - Math.pow(1 - progress, 3);
    return Math.floor(target * ease);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-6xl mx-auto flex flex-col items-center select-none ${
        isFullscreen ? 'fixed inset-0 z-50 max-w-none bg-black p-4 sm:p-8 justify-center' : ''
      }`}
    >
      {/* Top Bar: Aspect Ratio Switcher, Scenes & Resolution Badge */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
        {/* Aspect Ratio Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#181824] border border-[#2a2a3e] rounded-xl shadow-lg">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              aspectRatio === '16:9'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9 Widescreen (YouTube / FB)</span>
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              aspectRatio === '9:16'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-pink-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Reel (Instagram / Status)</span>
          </button>
        </div>

        {/* Scene Jump Selector */}
        <div className="hidden md:flex items-center gap-1 text-xs">
          {[
            { id: 1, time: 0, label: '01. Opening' },
            { id: 2, time: 5, label: '02. Stats' },
            { id: 3, time: 18, label: '03. Top Students' },
            { id: 4, time: 32, label: '04. Emotional' },
            { id: 5, time: 45, label: '05. Admissions' },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSeek(sc.time)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                currentScene === sc.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1f2e]'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Action Controls: Share & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow-sm transition-all"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Share</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e2e] hover:bg-[#28283e] border border-[#2e2e44] text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all"
            title="Copy Video Link"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedShare ? 'Copied!' : 'Copy Link'}</span>
          </button>
          <button
            onClick={handleDownloadVideo}
            disabled={isRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-medium rounded-lg shadow-md transition-all disabled:opacity-50"
            title="Download Video File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRecording ? 'Recording...' : 'Download WebM'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas & Overlays */}
      <div 
        className={`relative overflow-hidden rounded-2xl border border-[#2a2a3e] bg-[#000000] shadow-2xl transition-all duration-300 ${
          aspectRatio === '16:9' 
            ? 'w-full aspect-[16/9]' 
            : 'w-full max-w-[420px] aspect-[9/16]'
        }`}
      >
        {/* Background Visual Effects Canvas */}
        <canvas
          ref={canvasRef}
          width={aspectRatio === '16:9' ? 1280 : 720}
          height={aspectRatio === '16:9' ? 720 : 1280}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* ===============================================================
            SCENE 1 (0:00 - 0:05) — DRAMATIC OPENING
            Complete black screen, silence -> single spotlight from above ->
            Trophy revealed in spotlight glow -> text "Girls Academy"
            in gold gradient, "BISE Results 2025"
        =============================================================== */}
        {currentScene === 1 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-black transition-opacity duration-700">
            {/* Theatrical Spotlight from top */}
            <div 
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-full pointer-events-none transition-all duration-1000 ${
                currentTime >= 0.8 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.45) 0%, rgba(124, 58, 237, 0.2) 45%, rgba(0, 0, 0, 0) 75%)',
              }}
            />

            {/* Spotlight Beam Lines */}
            {currentTime >= 1.0 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-amber-100/30 via-amber-400/10 to-transparent blur-md pointer-events-none animate-pulse" />
            )}

            {/* Trophy Reveal with slow-zoom & golden rim */}
            <div 
              className={`relative z-20 transition-all duration-1000 transform ${
                currentTime >= 1.2 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-6'
              }`}
            >
              <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20 border border-amber-500/30 max-w-[260px] sm:max-w-[340px] aspect-[4/3]">
                <img
                  src={CELEBRATION_IMAGES.trophy}
                  alt="Golden Championship Trophy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.trophy;
                  }}
                  className="w-full h-full object-cover filter contrast-125 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                
                {/* Lens Flare Streak */}
                {currentTime >= 2.0 && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-80 blur-[2px] animate-pulse" />
                )}
              </div>
            </div>

            {/* Dramatic English Typography */}
            <div 
              className={`mt-6 z-20 transition-all duration-1000 transform ${
                currentTime >= 2.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-wider text-gold-gradient drop-shadow-[0_5px_15px_rgba(245,158,11,0.5)]">
                GIRLS ACADEMY
              </h1>
              
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-amber-400" />
                <p className="text-sm sm:text-xl font-bold tracking-widest text-slate-100 uppercase">
                  BISE RESULTS 2025
                </p>
                <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              <p className="text-sm sm:text-lg font-medium text-amber-300 mt-2 tracking-wide uppercase">
                Islamabad Board — Annual Academic Distinction 2025
              </p>
            </div>
          </div>
        )}

        {/* ===============================================================
            SCENE 2 (0:05 - 0:18) — ACHIEVEMENT STATS
            Dark background with gold particle confetti falling slowly
            Card 1 (purple): 95% Students Passed (0 to 95)
            Card 2 (pink): 42 A+ Grades (0 to 42)
            Card 3 (gold): 1st Position Across Islamabad District (star burst)
            Card 4 (purple-pink): 100% Matric Science Pass Rate
        =============================================================== */}
        {currentScene === 2 && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 bg-[#0b0a14] overflow-hidden">
            {/* Header banner */}
            <div className="text-center z-20">
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-400">
                BISE ISLAMABAD 2025 ANNUAL EXAMINATIONS
              </span>
              <h2 className="text-xl sm:text-3xl text-white font-extrabold mt-0.5 tracking-tight">
                Historic Academic Excellence & Milestones
              </h2>
            </div>

            {/* Stats Cards 2x2 Grid with dynamic entry animations */}
            <div className={`grid ${aspectRatio === '16:9' ? 'grid-cols-2 lg:grid-cols-4 gap-4' : 'grid-cols-2 gap-3'} my-auto z-20`}>
              {/* Card 1: 95% Students Passed (slides in from left) */}
              <div 
                className={`relative p-4 sm:p-6 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 5.2 
                    ? 'opacity-100 translate-x-0 scale-100 purple-glow border-purple-500/50 bg-[#161226]/80' 
                    : 'opacity-0 -translate-x-12 scale-95'
                }`}
              >
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <div className="font-cinzel text-3xl sm:text-5xl font-black text-purple-300 tracking-tight">
                  {getAnimatedCounter(95, 5.2, 7.8)}%
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mt-1">
                  Students Passed
                </div>
                <div className="text-[11px] sm:text-xs text-purple-300/80 mt-1 font-medium">
                  Overall Board Pass Rate
                </div>
              </div>

              {/* Card 2: 42 A+ Grades (slides in from right) */}
              <div 
                className={`relative p-4 sm:p-6 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 8.0 
                    ? 'opacity-100 translate-y-0 scale-100 pink-glow border-pink-500/50 bg-[#211124]/80' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
              >
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                <div className="font-cinzel text-3xl sm:text-5xl font-black text-pink-300 tracking-tight">
                  {getAnimatedCounter(42, 8.0, 10.5)}
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mt-1">
                  A+ Grades Secured
                </div>
                <div className="text-[11px] sm:text-xs text-pink-300/80 mt-1 font-medium">
                  Top Distinction Honors
                </div>
              </div>

              {/* Card 3: 1st Position Across Islamabad District (Gold glow with Star Burst) */}
              <div 
                className={`relative p-4 sm:p-6 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 11.0 
                    ? 'opacity-100 translate-x-0 scale-105 gold-glow border-amber-400/70 bg-[#241a0b]/85 ring-2 ring-amber-400/40' 
                    : 'opacity-0 translate-x-12 scale-90'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Star className="w-4 h-4 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Championship Honor</span>
                </div>
                <div className="text-2xl sm:text-4xl font-extrabold text-gold-gradient drop-shadow-md">
                  1st Position
                </div>
                <div className="text-base sm:text-xl font-bold text-slate-100 mt-1">
                  Islamabad District
                </div>
                <div className="text-[11px] sm:text-xs text-amber-300/80 mt-1 font-medium">
                  Highest Overall Score
                </div>
              </div>

              {/* Card 4: 100% Matric Science Pass Rate */}
              <div 
                className={`relative p-4 sm:p-6 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 14.2 
                    ? 'opacity-100 translate-y-0 scale-100 border-purple-400/50 bg-gradient-to-br from-purple-900/40 to-pink-900/40 shadow-xl' 
                    : 'opacity-0 translate-y-12 scale-95'
                }`}
              >
                <div className="font-cinzel text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 tracking-tight">
                  {getAnimatedCounter(100, 14.2, 17.0)}%
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mt-1">
                  Matric Science Pass Rate
                </div>
                <div className="text-[11px] sm:text-xs text-pink-200/80 mt-1 font-medium">
                  100% First Division Record
                </div>
              </div>
            </div>

            {/* Bottom ticker */}
            <div className="text-center text-xs text-slate-400 border-t border-[#2a2a3e]/60 pt-2 z-20">
              <span className="text-amber-400 font-semibold">Girls Academy Islamabad</span> · Inspiring Academic Milestones & Leadership
            </div>
          </div>
        )}

        {/* ===============================================================
            SCENE 3 (0:18 - 0:32) — TOP STUDENTS SPOTLIGHT
            Elegant cards appear one by one like award announcements:
            🥇 Fatima Zahra — 1,096/1,100 Marks — FSc Pre-Medical
            🥈 Ayesha Siddiqui — A+ Grade — Matric Science
            🥉 Zainab Khan — 3rd Position in District — ICS
        =============================================================== */}
        {currentScene === 3 && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 bg-[#0e0c18] overflow-hidden">
            {/* Header */}
            <div className="text-center z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-medium mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Roll of Honor · High Achievers</span>
              </div>
              <h2 className="text-2xl sm:text-4xl text-white font-extrabold tracking-tight">
                Girls Academy Top Scholars
              </h2>
            </div>

            {/* 3 Top Student Award Cards */}
            <div className="space-y-3.5 max-w-2xl mx-auto w-full my-auto z-20">
              {/* Student 1: Fatima Zahra (0:18 - 0:22.5) */}
              <div 
                className={`relative p-4 sm:p-5 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 18.2 
                    ? 'opacity-100 translate-x-0 scale-100 gold-border-glow bg-[#1d1624]/90 shadow-xl' 
                    : 'opacity-0 -translate-x-16 scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">🥇</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-3xl font-extrabold text-white">
                          Fatima Zahra
                        </span>
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        Overall 1st Position in Islamabad District
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm">
                      1,096 / 1,100 Marks
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
                      FSc Pre-Medical
                    </p>
                  </div>
                </div>
              </div>

              {/* Student 2: Ayesha Siddiqui (0:22.5 - 0:27) */}
              <div 
                className={`relative p-4 sm:p-5 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 22.5 
                    ? 'opacity-100 translate-x-0 scale-100 gold-border-glow bg-[#1a1324]/90 shadow-xl' 
                    : 'opacity-0 translate-x-16 scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">🥈</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-3xl font-extrabold text-white">
                          Ayesha Siddiqui
                        </span>
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        High Distinction Gold Medalist
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold text-xs sm:text-sm">
                      A+ Grade (1,084 Marks)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
                      Matric Science
                    </p>
                  </div>
                </div>
              </div>

              {/* Student 3: Zainab Khan (0:27 - 0:32) */}
              <div 
                className={`relative p-4 sm:p-5 rounded-2xl glass-card transition-all duration-700 transform ${
                  currentTime >= 27.0 
                    ? 'opacity-100 translate-y-0 scale-100 gold-border-glow bg-[#171222]/90 shadow-xl' 
                    : 'opacity-0 translate-y-12 scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">🥉</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-3xl font-extrabold text-white">
                          Zainab Khan
                        </span>
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        District 3rd Position in Computer Science
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-xs sm:text-sm">
                      3rd Position (1,072 Marks)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
                      ICS (Computer Science)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom quote */}
            <div className="text-center text-base sm:text-xl font-bold text-amber-300 z-20">
              Proud of Our Dedicated Scholars & Their Limitless Future
            </div>
          </div>
        )}

        {/* ===============================================================
            SCENE 4 (0:32 - 0:45) — EMOTIONAL MOMENT
            Slow motion girl opening result card, joy and disbelief
            Parent hugging daughter (real moment feel)
            Teacher smiling proudly
            Quotes:
            "This Triumph is the Fruit of Your Dedication"
            "We Are Immensely Proud of You"
        =============================================================== */}
        {currentScene === 4 && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 bg-[#090710] overflow-hidden">
            {/* Visual Sequence */}
            <div className="relative w-full max-w-3xl mx-auto h-[62%] rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a3e] z-10">
              {/* 32 to 36: Student result card joy */}
              {currentTime >= 32.0 && currentTime < 36.5 && (
                <div className="absolute inset-0 transition-opacity duration-700 animate-fadeIn">
                  <img
                    src={CELEBRATION_IMAGES.studentJoy}
                    alt="Student Joyful Result Card Moment"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.studentJoy;
                    }}
                    className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-lg sm:text-2xl text-amber-200 font-bold drop-shadow-lg">
                      Tears of Joy and Academic Pride
                    </p>
                    <p className="text-xs text-slate-300">A pure moment of dedication fulfilled</p>
                  </div>
                </div>
              )}

              {/* 36.5 to 40.5: Parent hug daughter */}
              {currentTime >= 36.5 && currentTime < 40.8 && (
                <div className="absolute inset-0 transition-opacity duration-700 animate-fadeIn">
                  <img
                    src={CELEBRATION_IMAGES.parentHug}
                    alt="Parents Hugging Daughter"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.parentHug;
                    }}
                    className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-lg sm:text-2xl text-pink-200 font-bold drop-shadow-lg">
                      A Family's Proud Moment
                    </p>
                    <p className="text-xs text-slate-300">Parental blessings, pride, and unconditional support</p>
                  </div>
                </div>
              )}

              {/* 40.8 to 45: Teacher & mentors */}
              {currentTime >= 40.8 && (
                <div className="absolute inset-0 transition-opacity duration-700 animate-fadeIn">
                  <img
                    src={CELEBRATION_IMAGES.teachersPride}
                    alt="Teachers Smiling Proudly"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = CELEBRATION_FALLBACK_IMAGES.teachersPride;
                    }}
                    className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-lg sm:text-2xl text-purple-200 font-bold drop-shadow-lg">
                      Dedicated Mentors & Faculty
                    </p>
                    <p className="text-xs text-slate-300">Inspiring teachers guiding every milestone</p>
                  </div>
                </div>
              )}
            </div>

            {/* Emotional English Quotes */}
            <div className="text-center z-20 mt-3 space-y-1">
              <div 
                className={`transition-all duration-700 transform ${
                  currentTime >= 33.0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-2xl sm:text-4xl font-extrabold text-gold-gradient drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                  "This Triumph is the Fruit of Your Dedication"
                </p>
              </div>

              <div 
                className={`transition-all duration-700 transform delay-300 ${
                  currentTime >= 35.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-xl sm:text-3xl font-bold text-white tracking-wide">
                  "We Are Immensely Proud of You"
                </p>
              </div>

              {/* Pulsing academy crest */}
              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/40 animate-pulse">
                  <div className="w-full h-full bg-[#120d22] rounded-[6px] flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                </div>
                <span className="font-semibold text-slate-200">Girls Academy Islamabad</span>
              </div>
            </div>
          </div>
        )}

        {/* ===============================================================
            SCENE 5 (0:45 - 1:00) — NEXT SESSION CALL TO ACTION
            Transition: gold particles transform to purple
            "Academic Session 2026-2027 Admissions Open"
            "Will Your Daughter Be Our Next High Achiever?"
            Programs list quickly scrolls: Matric | FSc | FA | ICS | I.Com | Primary | Middle
            Contact info: 📞 051-4861234, 💬 0300-4861234, 🌐 girlsacademy.edu.pk
            Final frame: Trophy + Girls Academy Logo + Tagline
        =============================================================== */}
        {currentScene === 5 && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 bg-[#0b0a16] overflow-hidden">
            {/* Header CTA */}
            <div className="text-center z-20">
              <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-1 animate-pulse">
                New Academic Session 2026-2027
              </span>
              <h2 className="text-2xl sm:text-4xl text-white font-extrabold tracking-tight">
                Academic Session 2026-2027 Admissions Open
              </h2>
              <p className="text-lg sm:text-2xl text-amber-300 font-bold mt-1">
                Will Your Daughter Be Our Next High Achiever?
              </p>
            </div>

            {/* Programs scrolling ribbon */}
            <div className="relative overflow-hidden py-2 bg-[#171328]/80 border-y border-[#2a2a3e] z-20 my-auto">
              <div className="flex items-center gap-4 animate-marquee whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-200">
                {CELEBRATION_PROGRAMS.concat(CELEBRATION_PROGRAMS).map((prog, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    <span>{prog}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto w-full z-20">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1b152e]/90 border border-purple-500/30">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Phone Line</p>
                  <p className="text-xs sm:text-sm font-bold text-white">{ACADEMY_CONTACT.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#12231c]/90 border border-emerald-500/30">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">WhatsApp</p>
                  <p className="text-xs sm:text-sm font-bold text-white">{ACADEMY_CONTACT.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1e1528]/90 border border-pink-500/30">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">Website</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{ACADEMY_CONTACT.website}</p>
                </div>
              </div>
            </div>

            {/* Final Grand Frame (55s - 60s) */}
            <div className="text-center border-t border-[#2a2a3e] pt-3 z-20">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="font-cinzel text-lg sm:text-2xl font-black text-gold-gradient tracking-wide">
                  GIRLS ACADEMY ISLAMABAD
                </span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-base sm:text-xl font-bold text-amber-300 mt-0.5">
                {ACADEMY_CONTACT.tagline}
              </p>
            </div>
          </div>
        )}

        {/* Big Centered Play Overlay when paused on start */}
        {!isPlaying && currentTime === 0 && (
          <div 
            onClick={handlePlay}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors group"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-1 shadow-2xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
              <div className="w-full h-full bg-[#100d1c] rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-amber-300 fill-amber-300 ml-1 group-hover:text-white group-hover:fill-white transition-colors" />
              </div>
            </div>
            <p className="mt-4 font-cinzel text-lg sm:text-xl font-bold text-white tracking-widest">
              PLAY CELEBRATION VIDEO
            </p>
            <p className="text-sm sm:text-base text-amber-300 mt-1 font-medium">
              Click to watch the official 2025 results ceremony
            </p>
          </div>
        )}
      </div>

      {/* Video Control Bar */}
      <div className="w-full mt-3 p-3 sm:p-4 bg-[#141220] border border-[#2a2a3e] rounded-xl shadow-xl flex flex-col gap-3">
        {/* Scrubber Slider with Scene Markers */}
        <div className="relative w-full">
          <div className="absolute top-0 inset-x-0 h-2 flex justify-between pointer-events-none px-1">
            <span className="w-0.5 h-full bg-slate-600/50" title="Scene 1: 0s" />
            <span className="w-0.5 h-full bg-amber-500/60" style={{ left: '8.3%' }} title="Scene 2: 5s" />
            <span className="w-0.5 h-full bg-purple-500/60" style={{ left: '30%' }} title="Scene 3: 18s" />
            <span className="w-0.5 h-full bg-pink-500/60" style={{ left: '53.3%' }} title="Scene 4: 32s" />
            <span className="w-0.5 h-full bg-amber-400/80" style={{ left: '75%' }} title="Scene 5: 45s" />
          </div>

          <input
            type="range"
            min="0"
            max={TOTAL_DURATION}
            step="0.1"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#222034] rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          {/* Left: Play/Pause, Restart, Time readout */}
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-md shadow-amber-500/20"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="w-8 h-8 rounded-lg bg-[#201d32] hover:bg-[#2c2944] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Restart Video"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="font-mono text-xs text-slate-300 font-semibold tracking-wider">
              <span className="text-amber-400">{formatTime(currentTime)}</span>
              <span className="text-slate-600"> / </span>
              <span>{formatTime(TOTAL_DURATION)}</span>
            </div>

            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#221f36] text-amber-300 border border-[#2e2a4a]">
              Scene {currentScene}/5
            </span>
          </div>

          {/* Center: Playback Speed */}
          <div className="flex items-center gap-1 bg-[#1c192d] p-0.5 rounded-lg border border-[#2c2842] text-xs">
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => setActiveSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeSpeed === speed
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Right: Audio Volume & Fullscreen */}
          <div className="flex items-center gap-3">
            {/* Audio Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1.5 bg-[#25223a] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-[#201d32] hover:bg-[#2c2944] text-slate-300 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
