import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
      <div className='flex items-center justify-between'>
      <div className='text-[14px] text-text-secondary'>{label}</div>

        <div className='flex cursor-pointer gap-0.5' onClick={toggleAccordion}>
          <span className='flex items-center justify-center bg-shad-white-10 p-1 px-2 text-[14px] text-text-primary'>
            <code>{methodName}</code>
          </span>
          <div className='flex w-[30px] items-center justify-center rounded-r-sm bg-shad-white-10 text-text-primary'>
            <ChevronDown
              className={`${isOpen ? "rotate-180" : ""}`}
              width={16}
            />
          </div>
        </div>
      </div>

      {isOpen && <div className='mt-2 w-full'>{children}</div>}
    </>
  );
};

export default TxAccordion;
