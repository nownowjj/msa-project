// components/playlist/SkeletonCard.tsx
const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-video w-full rounded-2xl bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
};