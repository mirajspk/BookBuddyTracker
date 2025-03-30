interface ProgressBarProps {
  value: number;
  max?: number;
  height?: string;
  showText?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  height = "h-1.5", 
  showText = false
}) => {
  const percentage = Math.min(Math.max(0, value), max) / max * 100;
  
  return (
    <div className="flex items-center w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div 
          className={`bg-primary ${height} rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showText && (
        <span className="ml-2 text-xs text-gray-500">{value}%</span>
      )}
    </div>
  );
};

export default ProgressBar;
