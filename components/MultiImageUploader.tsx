"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type MultiImageUploaderProps = {
  onUploaded: (urls: string[]) => void;
};

export default function MultiImageUploader({
  onUploaded,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function uploadImages(files: FileList) {
    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
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
        alert("Помилка завантаження одного з фото");
        continue;
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/property-images/${filePath}`;

      uploadedUrls.push(publicUrl);
    }

    onUploaded(uploadedUrls);
    setUploading(false);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <label className="block cursor-pointer">
        <span className="block text-sm text-white/40">
          Завантажити фото для галереї
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files) uploadImages(e.target.files);
          }}
          className="mt-3 block w-full text-sm text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
        />
      </label>

      {uploading && (
        <p className="mt-3 text-sm text-white/40">Завантаження фото...</p>
      )}
    </div>
  );
}