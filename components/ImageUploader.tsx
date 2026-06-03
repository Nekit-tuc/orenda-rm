"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ImageUploaderProps = {
  onUploaded: (url: string) => void;
};

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `properties/${fileName}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (error) {
      console.error(error);
      alert("Помилка завантаження фото");
      setUploading(false);
      return;
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/property-images/${filePath}`;

    onUploaded(publicUrl);
    setUploading(false);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <label className="block cursor-pointer">
        <span className="block text-sm text-white/40">
          Завантажити головне фото
        </span>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
          className="mt-3 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
        />
      </label>

      {uploading && (
        <p className="mt-3 text-sm text-white/40">Завантаження...</p>
      )}
    </div>
  );
}