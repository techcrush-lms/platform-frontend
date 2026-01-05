interface CircularProgressProps {
  percentage: number;
}
const CircularProgress = ({ percentage }: CircularProgressProps) => {
  // If percentage > 100, use a different color for the progress circle
  const strokeDashoffset = 100 - Math.min(percentage, 100);
  const isOver100 = percentage > 100;

  // Use Tailwind color classes for theme friendliness
  const progressColor = isOver100
    ? 'var(--tw-prog-green, #22c55e)'
    : 'var(--tw-prog-blue, #0071E3)';
  // Use Tailwind for background circle
  const bgColor = 'var(--tw-prog-bg, #E5E5E7)';

  return (
    <div className='relative w-12 h-12'>
      <svg className='w-full h-full' viewBox='0 0 36 36'>
        {/* Background circle */}
        <path
          d='M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831'
          fill='none'
          stroke={bgColor}
          strokeWidth='2'
        />
        {/* Progress circle */}
        <path
          d='M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831'
          fill='none'
          stroke={progressColor}
          strokeWidth='2'
          strokeDasharray='100, 100'
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium ${
          isOver100
            ? 'text-green-600 dark:text-green-400'
            : 'text-primary-main dark:text-primary-300'
        }`}
      >
        {Number(percentage)}%
        {isOver100 && <span className='ml-1 text-[10px] font-bold'>+</span>}
      </span>
    </div>
  );
};

export default CircularProgress;
