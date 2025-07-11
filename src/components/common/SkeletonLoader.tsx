type SkeletonType = 'line' | 'circle' | 'card' | 'button';

interface SkeletonLoaderProps {
  type?: SkeletonType;
  count?: number;
}

export function SkeletonLoader({
  type = 'line',
  count = 1
}: SkeletonLoaderProps) {
  const skeletonTypes: Record<SkeletonType, string> = {
    line: 'h-4 w-full',
    circle: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-lg',
    button: 'h-10 w-32 rounded-md'
  };
  return <>
      {[...Array(count)].map((_, i) => <div key={i} className="animate-pulse">
          <div className={`bg-gray-200 ${skeletonTypes[type]} mb-2`}></div>
        </div>)}
    </>;
}