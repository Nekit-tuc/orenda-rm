type SharePropertyInput = {
  title: string;
  text: string;
  url: string;
};

export async function shareProperty({ title, text, url }: SharePropertyInput) {
  const shareData = {
    title,
    text,
    url,
  };

  if (navigator.share) {
    await navigator.share(shareData);
    return "shared" as const;
  }

  await navigator.clipboard.writeText(url);
  return "copied" as const;
}
