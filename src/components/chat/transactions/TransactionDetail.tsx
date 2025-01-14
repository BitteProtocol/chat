
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
    <div className="bitte-text-text-secondary">{label}</div>
    <div className="bitte-break-all bitte-text-gray-800">{value}</div>
  </div>
);
