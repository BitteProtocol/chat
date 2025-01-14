
export const TransactionDetail = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | JSX.Element;
  className?: string;
}) => (
  <div className={`flex items-center justify-between text-sm ${className}`}>
    <div className='text-text-secondary'>{label}</div>
    <div className='break-all text-gray-800'>{value}</div>
  </div>
);
