import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { formatName, shortenString } from "../../lib/utils";

export const CopyStandard = ({
  text,
  textSize,
  charSize,
  isUrl,
}: {
  text: string;
  textSize?: string;
  charSize?: number;
  isUrl?: boolean;
}) => {
  const [showLinkCopiedText, setShowLinkCopiedText] = useState(false);

  const { width } = useWindowSize();
  const isMobile = !!width && width < 1024;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(text);

    setShowLinkCopiedText(true);
    setTimeout(() => setShowLinkCopiedText(false), 3000);
  };

  return (
    <div id='copy' className="bitte-cursor-pointer bitte-p-2.5" onClick={handleCopyLink}>
      <span
        className={`bitte-relative bitte-flex bitte-items-center bitte-justify-center bitte-gap-2 ${textSize ? `bitte-text-${textSize}` : "bitte-text-base"}`}
      >
        {showLinkCopiedText
          ? "Copied"
          : isUrl
          ? formatName(text, isMobile ? charSize ?? 18 : charSize ?? 35)
          : shortenString(
              text,
              isMobile ? charSize ?? 18 : charSize ?? 35
            )}{" "}
        <CopyIcon size={16} className="bitte-text-shad-blue-100" />
      </span>
    </div>
  );
};
