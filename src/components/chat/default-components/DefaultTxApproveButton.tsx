import { TransactionButtonProps } from "../../../types";
import { Button } from "../../ui/button";

const DefaultTxApproveButton: React.FC<TransactionButtonProps> = ({
  onClick,
  disabled,
  isLoading,
  label,
}) => (
  <Button className='bitte-w-1/2' onClick={onClick} disabled={disabled}>
    {isLoading ? "Confirming..." : label || "Approve"}
  </Button>
);

export default DefaultTxApproveButton;
