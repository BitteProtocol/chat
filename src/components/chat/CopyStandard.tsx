import { CopyIcon } from "lucide-react";
import React, { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { formatName, shortenString } from "../../lib/utils";

export const CopyStandard = ({
  text,
  textColor,
  textSize,
  charSize,
  isUrl,
}: {
  text: string;
  textColor?: string;
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
    <div id="copy" className="cursor-pointer p-2.5" onClick={handleCopyLink}>
      <span
        className={`relative flex items-center justify-center gap-2 ${
          textColor ? `text-${textColor}` : "text-shad-blue-100"
        } ${textSize ? `text-${textSize}` : "text-base"}`}
      >
        {showLinkCopiedText
          ? "Copied"
          : isUrl
          ? formatName(text, isMobile ? charSize ?? 18 : charSize ?? 35)
          : shortenString(
              text,
              isMobile ? charSize ?? 18 : charSize ?? 35
            )}{" "}
        <CopyIcon size={16} className="text-shad-blue-100" />
      </span>
    </div>
  );
};
