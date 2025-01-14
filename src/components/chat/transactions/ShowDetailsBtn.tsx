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
      className="bitte-flex bitte-cursor-pointer bitte-items-center bitte-justify-center bitte-gap-2 bitte-bg-shad-white-30 bitte-py-4"
      onClick={() => setShowDetails(!showDetails)}
    >
      {showDetails ? (
        <ChevronsDownUp width={16} height={16} color='#64748B' />
      ) : (
        <ChevronsUpDown width={16} height={16} color='#64748B' />
      )}
      <span className="text-[12px] bitte-text-text-secondary">{displayName}</span>
      </div>
  );
};
