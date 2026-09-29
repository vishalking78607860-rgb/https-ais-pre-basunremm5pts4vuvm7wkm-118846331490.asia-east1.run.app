import React, { useState, useEffect } from 'react';
import { ThumbsUp, Heart, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiLikeWebsite } from '../utils/api';
import { playClickBeep } from '../utils/storage';

interface LikeButtonProps {
  likesCount?: number;
  onLikeUpdate?: (count: number) => void;
  variant?: 'banner' | 'compact';
  lang?: 'hi' | 'en';
  soundEnabled?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  likesCount = 14850,
  onLikeUpdate,
  variant = 'compact',
  lang = 'hi',
  soundEnabled = true,
}) => {
  const [currentLikes, setCurrentLikes] = useState<number>(likesCount);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    if (likesCount) {
      setCurrentLikes(likesCount);
    }
  }, [likesCount]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liked = localStorage.getItem('satta_user_has_liked') === 'true';
      setHasLiked(liked);
    }
  }, []);

  const handleLike = async () => {
    if (soundEnabled) playClickBeep();
    if (isLiking) return;

    setIsLiking(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }

    const nextCount = currentLikes + 1;
    setCurrentLikes(nextCount);
    setHasLiked(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('satta_user_has_liked', 'true');
    }
    if (onLikeUpdate) {
      onLikeUpdate(nextCount);
    }

    await apiLikeWebsite();
    setIsLiking(false);
  };

  // Header / Compact Variant
  if (variant === 'compact') {
    return (
      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all active:scale-95 ${
          hasLiked
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
            : 'bg-neutral-800/80 hover:bg-neutral-700/80 border-neutral-700 text-neutral-300 hover:text-white'
        }`}
        title="Like this website"
      >
        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-rose-400'}`} />
        <span>{currentLikes.toLocaleString('en-IN')}</span>
      </button>
    );
  }

  // Full Banner Variant
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-neutral-800 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
          <Heart className={`w-5 h-5 ${hasLiked ? 'fill-rose-500' : ''}`} />
        </div>
        <div>
          <h4 className="font-chakra font-black text-white text-sm sm:text-base uppercase tracking-wide flex items-center gap-2 justify-center sm:justify-start">
            <span>{lang === 'hi' ? 'वेबसाइट को लाइक करें' : 'LIKE THIS WEBSITE'}</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold">
              {currentLikes.toLocaleString('en-IN')} Likes
            </span>
          </h4>
          <p className="text-[11px] sm:text-xs text-neutral-400 font-hind">
            {lang === 'hi'
              ? 'अगर आपको सबसे तेज लाइव रिजल्ट पसंद आ रहा है तो लाइक करके सपोर्ट करें!'
              : 'Support the fastest live result portal by giving a like!'}
          </p>
        </div>
      </div>

      <button
        onClick={handleLike}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-95 ${
          hasLiked
            ? 'bg-rose-600/30 border border-rose-500/50 text-rose-300 cursor-default'
            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30'
        }`}
      >
        {hasLiked ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'लाइक कर दिया ❤️' : 'Liked ❤️'}</span>
          </>
        ) : (
          <>
            <ThumbsUp className="w-4 h-4" />
            <span>{lang === 'hi' ? 'लाइक करें 👍' : 'Like Website 👍'}</span>
          </>
        )}
      </button>
    </div>
  );
};
