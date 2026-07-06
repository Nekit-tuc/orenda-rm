import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const allowedTypes = ["Земля", "Комерція", "Будинок"] as const;
const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024;
const maxFiles = 15;
const bucketName = "property-submissions";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function isAllowedObjectType(value: string): value is (typeof allowedTypes)[number] {
  return allowedTypes.includes(value as (typeof allowedTypes)[number]);
}

function safeFileName(file: File, index: number) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  return `${Date.now()}-${index}-${baseName || "photo"}.${extension}`;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return Response.json({ ok: false, message: "Некоректні дані." }, { status: 400 });
  }

  const fullName = textValue(formData, "fullName");
  const phone = textValue(formData, "phone");
  const telegram = textValue(formData, "telegram");
  const objectType = textValue(formData, "objectType");
  const address = textValue(formData, "address");
  const area = textValue(formData, "area");
  const price = textValue(formData, "price");
  const cadastralNumber = textValue(formData, "cadastralNumber");
  const description = textValue(formData, "description");
  const photos = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (!fullName || !phone || !address || !area || !price || !cadastralNumber) {
    return Response.json(
      { ok: false, message: "Заповніть усі обовʼязкові поля." },
      { status: 400 }
    );
  }

  if (!isAllowedObjectType(objectType)) {
    return Response.json(
      { ok: false, message: "Можна запропонувати тільки землю, комерцію або будинок." },
      { status: 400 }
    );
  }

  if (photos.length < 1) {
    return Response.json(
      { ok: false, message: "Додайте мінімум 1 фото обʼєкта або плану." },
      { status: 400 }
    );
  }

  if (photos.length > maxFiles) {
    return Response.json(
      { ok: false, message: "Можна додати максимум 15 фото." },
      { status: 400 }
    );
  }

  const invalidPhoto = photos.find(
    (file) => !allowedFileTypes.includes(file.type) || file.size > maxFileSize
  );

  if (invalidPhoto) {
    return Response.json(
      { ok: false, message: "Фото мають бути jpg, jpeg, png або webp до 10MB." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: submission, error: insertError } = await supabase
    .from("property_submissions")
    .insert({
      full_name: fullName,
      phone,
      telegram: telegram || null,
      object_type: objectType,
      address,
      area,
      price,
      cadastral_number: cadastralNumber,
      description: description || null,
    })
    .select("id")
    .single();

  if (insertError || !submission?.id) {
    console.error("PROPERTY SUBMISSION INSERT ERROR:", insertError);

    return Response.json(
      { ok: false, message: "Не вдалося створити заявку. Спробуйте ще раз." },
      { status: 500 }
    );
  }

  const uploadedUrls: string[] = [];

  for (const [index, file] of photos.entries()) {
    const path = `${submission.id}/${safeFileName(file, index)}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("PROPERTY SUBMISSION PHOTO UPLOAD ERROR:", uploadError);
      await supabase.from("property_submissions").delete().eq("id", submission.id);

      return Response.json(
        {
          ok: false,
          message: "Не вдалося завантажити фото. Перевірте Storage bucket.",
        },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    uploadedUrls.push(data.publicUrl);
  }

  const { error: updateError } = await supabase
    .from("property_submissions")
    .update({ photos: uploadedUrls })
    .eq("id", submission.id);

  if (updateError) {
    console.error("PROPERTY SUBMISSION PHOTOS UPDATE ERROR:", updateError);

    return Response.json(
      { ok: false, message: "Заявку створено, але фото не збережено в таблицю." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, id: submission.id });
}
