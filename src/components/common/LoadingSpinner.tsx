type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

const LoadingSpinner = ({
  size,
  label
}: { size: LoadingSpinnerSize; label: string }) => {

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 animate-pulse">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-blue-600/30"></div>
        <div className="absolute h- inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <span className="text-sm text-gray-500 animate-pulse">{label}</span>
    </div>
  );
}

export default LoadingSpinner;