'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import ModalShell from '@/components/ModalShell';
import type { Folder } from '@/lib/bookmarks/types';

const emojiOptions = ['📚', '🩺', '🧠', '✨', '📝', '🎯', '💊', '🫁'];

interface EditFolderModalProps {
  folder: Folder | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (input: { name: string; emoji: string }) => Promise<void>;
}

export default function EditFolderModal({
  folder,
  isOpen,
  isLoading = false,
  onClose,
  onSave,
}: EditFolderModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(folder?.name ?? '');
  const [emoji, setEmoji] = useState(folder?.emoji ?? '📚');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  function handleClose() {
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Folder name is required.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Folder names must be 50 characters or fewer.');
      return;
    }

    try {
      setError(null);
      await onSave({ name: trimmedName, emoji });
      handleClose();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to update folder.');
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} title="Edit folder">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--linen-light)] text-2xl">
              {emoji}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/70">Edit folder</p>
              <h2 className="mt-1 font-display text-2xl text-[var(--espresso)]">Update folder details</h2>
            </div>
          </div>
          <p className="text-sm text-[var(--charcoal)]/72">
            Rename it or change the icon.
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-[var(--charcoal)]">Folder name</span>
          <input
            ref={inputRef}
            value={name}
            maxLength={50}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-[18px] border border-black/10 bg-[var(--linen-light)] px-4 py-3 text-[var(--espresso)] outline-none transition focus:border-black/20"
            placeholder="Exam prep"
          />
        </label>

        <div>
          <p className="mb-2 text-sm text-[var(--charcoal)]">Choose an icon</p>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEmoji(option)}
                className={`rounded-[16px] border px-3 py-2 text-xl transition ${
                  emoji === option
                    ? 'border-[var(--espresso)] bg-[var(--linen-light)]'
                    : 'border-black/8 bg-white hover:border-black/14'
                }`}
                aria-label={`Choose ${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="rounded-[16px] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-black/10 px-4 py-2 text-sm text-[var(--charcoal)] transition hover:border-black/16"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-[var(--espresso)] px-5 py-2 text-sm text-white transition hover:bg-[#3a2010] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
