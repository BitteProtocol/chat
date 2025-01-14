import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

export const ShowDetailsBtn = ({
  setShowDetails,
  showDetails,
  displayName,
}: {
  setShowDetails: (showDetails: boolean) => void;
  showDetails: boolean;
  displayName: string;
}): JSX.Element => {
  return (
    <div
      className='flex cursor-pointer items-center justify-center gap-2 bg-shad-white-30 py-4'
      onClick={() => setShowDetails(!showDetails)}
    >
      {showDetails ? (
        <ChevronsDownUp width={16} height={16} color='#64748B' />
      ) : (
        <ChevronsUpDown width={16} height={16} color='#64748B' />
      )}
      <span className='text-[12px] text-text-secondary'>{displayName}</span>
      </div>
  );
};
