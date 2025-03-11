import { TransactionButtonProps } from "../../../types";
import { Button } from "../../ui/button";

const DefaultTxDeclineButton: React.FC<TransactionButtonProps> = ({
  onClick,
  disabled,
  label,
}) => (
  <Button
    variant='outline'
    className='bitte-w-1/2'
    onClick={onClick}
    disabled={disabled}
  >
    {label || "Decline"}
  </Button>
);

export default DefaultTxDeclineButton;
