import { TransactionContainerProps } from "../../../types";
import { Card } from "../../ui/card";

const DefaultTxContainer: React.FC<TransactionContainerProps> = ({
  children,
  style,
}) => (
  <Card
    className='bitte:mb-8 bitte:flex bitte:flex-col bitte:justify-center bitte:w-full'
    style={{
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      color: style.textColor,
    }}
  >
    {children}
  </Card>
);
export default DefaultTxContainer;
