import Image from "next/image";

export function Gallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  if (photos.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((src, i) => (
        <div
          key={src}
          className="relative aspect-[4/3] overflow-hidden rounded-xl"
        >
          <Image
            src={src}
            alt={`${title} — foto ${i + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
