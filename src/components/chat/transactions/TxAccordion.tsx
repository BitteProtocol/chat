import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const TxAccordion = ({
  label,
  methodName,
  children,
}: {
  label: string;
  methodName: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleAccordion = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <>
      <div className="bitte-flex bitte-items-center bitte-justify-between">
        <div className="bitte-text-[14px] bitte-text-text-secondary">
          {label}
        </div>

        <div
          className="bitte-flex bitte-cursor-pointer bitte-gap-0.5"
          onClick={toggleAccordion}
        >
          <span className="bitte-flex bitte-items-center bitte-justify-center bitte-bg-shad-white-10 bitte-p-1 bitte-px-2 bitte-text-[14px] bitte-text-text-primary">
            <code>{methodName}</code>
          </span>
          <div className="bitte-flex bitte-w-[30px] bitte-items-center bitte-justify-center bitte-rounded-r-sm bitte-bg-shad-white-10 bitte-text-text-primary">
            <ChevronDown
              className={`${isOpen ? 'rotate-180' : ''}`}
              width={16}
            />
          </div>
        </div>
      </div>

      {isOpen && <div className="bitte-mt-2 bitte-w-full">{children}</div>}
    </>
  );
};

export default TxAccordion;
