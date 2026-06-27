import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStamp } from '@/stores/useStamps';
import { db } from '@/db/database';
import { StampDisplay } from '@/components/ui/StampDisplay';
import { HoldButton } from '@/components/ui/HoldButton';
import { EncounterCounter } from '@/components/ui/EncounterCounter';

export default function StampDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stamp = useStamp(Number(id));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUnlock = async () => {
    if (!stamp?.id) return;
    await db.stamps.update(stamp.id, { unlockedAt: new Date() });
  };

  const handleDelete = async () => {
    if (!stamp?.id) return;
    await db.stamps.delete(stamp.id);
    navigate('/');
  };

  if (!stamp) {
    return (
      <div className="flex flex-col items-center justify-center h-60 px-4 gap-3">
        <span className="text-4xl">🔍</span>
        <p className="text-zhu-muted text-sm">Stamp not found</p>
        <button
          onClick={() => navigate('/')}
          className="text-zhu-accent text-sm underline tap-target"
        >
          Go back home
        </button>
      </div>
    );
  }

  const isLocked = stamp.unlockedAt === null;

  return (
    <div className="flex flex-col items-center px-4 py-6 gap-5">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="tap-target self-start text-zhu-muted text-sm flex items-center gap-1"
      >
        <span>←</span> <span>Back</span>
      </button>

      {/* Large stamp display */}
      <StampDisplay stamp={stamp} size={240} />

      {/* Stamp name */}
      <h2 className="text-xl font-bold text-zhu-text text-center">{stamp.name}</h2>

      {/* Description */}
      <p className="text-sm text-zhu-muted text-center max-w-xs">
        {stamp.description}
      </p>

      {/* Locked state info */}
      {isLocked && (
        <div className="text-center">
          <p className="text-sm text-zhu-muted mb-1">🔒 Not yet discovered</p>
          <p className="text-xs text-zhu-muted">Press and hold to unlock</p>
        </div>
      )}

      {/* Unlocked info */}
      {!isLocked && stamp.unlockedAt && (
        <p className="text-xs text-zhu-muted">
          Unlocked: {stamp.unlockedAt.toLocaleDateString()} at {stamp.unlockedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      {/* Hold to unlock button — only when locked */}
      {isLocked ? (
        <HoldButton
          onComplete={handleUnlock}
          label="Unlock"
          duration={3000}
          size={100}
          color="#FF69B4"
        />
      ) : (
        /* Encounter counter — only when unlocked */
        <div className="mt-2">
          <p className="text-xs text-zhu-muted text-center mb-2">Encounters</p>
          <EncounterCounter stampId={stamp.id!} count={stamp.encounterCount} />
        </div>
      )}

      {/* Built-in / AI badge */}
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
        stamp.isBuiltIn
          ? 'bg-gray-100 text-zhu-muted'
          : 'bg-purple-100 text-purple-600'
      }`}>
        {stamp.isBuiltIn ? 'Built-in' : 'AI Generated ✨'}
      </span>

      {/* Delete */}
      <div className="w-full max-w-xs pt-4 mt-4 border-t border-gray-100">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="tap-target w-full py-2 text-xs text-red-400 font-medium rounded-lg
              active:bg-red-50 transition-colors"
          >
            Delete this Zhu
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500 font-medium">Are you sure?</span>
            <button
              onClick={handleDelete}
              className="tap-target px-4 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full
                active:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="tap-target px-4 py-1.5 bg-gray-100 text-zhu-muted text-xs font-semibold rounded-full
                active:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}