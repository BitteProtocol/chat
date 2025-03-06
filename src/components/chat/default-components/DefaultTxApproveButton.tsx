import { TransactionButtonProps } from "../../../types";
import { Button } from "../../ui/button";

const DefaultTxApproveButton: React.FC<TransactionButtonProps> = ({
  onClick,
  disabled,
  isLoading,
}) => (
  <Button className='bitte-w-1/2' onClick={onClick} disabled={disabled}>
    {isLoading ? "Confirming..." : "Approve"}
  </Button>
);

export default DefaultTxApproveButton;
