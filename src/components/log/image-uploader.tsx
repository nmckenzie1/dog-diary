"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  file: File | null;
  onFileChange: (file: File | null) => void;
};

export function ImageUploader({ file, onFileChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  function openPicker() {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    onFileChange(selected);
    // Allow selecting the same file again after cancel/retry.
    event.target.value = "";
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id="photo"
        name="photo"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button type="button" className="w-full" onClick={openPicker} aria-label="Upload photo proof">
        {file ? "Change proof photo" : "Upload proof photo"}
      </Button>
      {previewUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Image
            src={previewUrl}
            alt="Selected hot dog proof photo preview"
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Photo proof is required for each log entry.</p>
      )}
    </div>
  );
}




