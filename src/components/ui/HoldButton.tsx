import { useState, useRef, useCallback, useEffect } from 'react';
import { ProgressRing } from './ProgressRing';

interface HoldButtonProps {
  onComplete: () => void;
  duration?: number;
  label?: string;
  disabled?: boolean;
  size?: number;
  color?: string;
}

export function HoldButton({
  onComplete,
  duration = 3000,
  label = 'Hold',
  disabled = false,
  size = 80,
  color = '#FF69B4',
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const completedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = 0;
    }
  }, []);

  const startHold = useCallback(() => {
    if (disabled) return;
    completedRef.current = false;
    setIsHolding(true);
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct >= 1 && !completedRef.current) {
        completedRef.current = true;
        clearTimer();
        setIsHolding(false);
        setProgress(0);
        onComplete();
      }
    }, 16);
  }, [duration, onComplete, disabled, clearTimer]);

  const endHold = useCallback(() => {
    clearTimer();
    setIsHolding(false);
    if (!completedRef.current) {
      setProgress(0);
    }
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <button
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      disabled={disabled}
      className={`relative rounded-full no-select tap-target flex items-center justify-center transition-opacity ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer'
      }`}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      {/* Progress ring */}
      <ProgressRing
        progress={progress}
        size={size}
        strokeWidth={4}
        color={disabled ? '#CCC' : color}
      />
      {/* Label */}
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-bold z-10"
        style={{ color: disabled ? '#999' : '#4A4A4A' }}
      >
        {isHolding && progress > 0 && progress < 1
          ? `${Math.ceil((1 - progress) * (duration / 1000))}s`
          : label}
      </span>
    </button>
  );
}