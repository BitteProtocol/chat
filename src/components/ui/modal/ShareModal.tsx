import React, { useState } from "react";

import { useWindowSize } from "../../../hooks/useWindowSize";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Drawer, DrawerContent, DrawerFooter } from "../drawer";
import { Input } from "../input";
import { Label } from "../label";

interface ShareModalProps {
  title: string;
  shareText: string;
  trigger: JSX.Element;
  shareLink: string;
  subtitle?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  title,
  shareText,
  trigger,
  shareLink,
  subtitle,
}) => {
  const [open, setOpen] = useState(false);
  const [showLinkCopiedText, setShowLinkCopiedText] = useState(false);

  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  const social = {
    twitter: `https://twitter.com/intent/tweet?url=${shareLink}&text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`,
    telegram: `https://telegram.me/share/url?url=${shareLink}&text=${shareText}`,
  };

  const handleCopyLink = async () => {
    const url = new URL(shareLink);

    await navigator.clipboard.writeText(url.href);

    setShowLinkCopiedText(true);
    setTimeout(() => setShowLinkCopiedText(false), 3000);
  };

  const dialogTitleInfo = (
    <>
      <DialogTitle className="bitte-mb-2 text-[20px] bitte-font-semibold">
        {title}
      </DialogTitle>
      {subtitle && <p className="text-[14px]">{subtitle}</p>}
    </>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:w-[400px]">
          <DialogHeader>
            <DialogTitle className="bitte-mb-2 bitte-text-center bitte-text-xl bitte-text-gray-800">
              {title}
            </DialogTitle>
            <DialogDescription className="bitte-text-center bitte-text-gray-800">
              {subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="bitte-mt-4 bitte-grid bitte-w-full bitte-max-w-sm bitte-items-center bitte-gap-1.5">
            <Label htmlFor='smart-action-link' className="bitte-text-gray-800">
              Link
            </Label>
            <Input
              id='smart-action-link'
              value={shareLink}
              readOnly
              className="bitte-text-gray-800"
            />
          </div>
          <div className="bitte-flex bitte-items-center bitte-gap-4">
            <Button
              className="bitte-w-full"
              variant='outline'
              onClick={() => window.open(social.twitter, "_blank")}
            >
              <img src='/twitter_black.svg' className="bitte-theme-icon bitte-h-5 bitte-w-5" />
            </Button>
            <Button
              className="bitte-w-full"
              variant='outline'
              onClick={() => window.open(social.telegram, "_blank")}
            >
              <img src='/telegram_black.svg' className="bitte-theme-icon bitte-h-5 bitte-w-5" />
            </Button>
            <Button
              className="bitte-w-full"
              variant='outline'
              onClick={() => window.open(social.facebook, "_blank")}
            >
              <img src='/facebook_black.svg' className="bitte-theme-icon bitte-h-5 bitte-w-5" />
            </Button>
          </div>
          <div>
            <Button className="bitte-w-full" onClick={handleCopyLink}>
              {showLinkCopiedText ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bitte-border-0 bitte-focus:ring-0" asChild>
        {trigger}
      </DialogTrigger>
      <DrawerContent className="bitte-flex bitte-gap-4 bitte-px-2">
        <div className="bitte-text-center bitte-text-gray-800">{dialogTitleInfo}</div>
        <div className="bitte-mt-4 bitte-grid bitte-w-full bitte-items-center bitte-gap-1.5">
          <Label htmlFor='smart-action-link' className="bitte-text-gray-800">
            Link
          </Label>
          <Input
            id='smart-action-link'
            value={shareLink}
            readOnly
            className="bitte-text-gray-800"
          />
        </div>
        <div className="bitte-flex bitte-items-center bitte-gap-4">
          <Button
            className="bitte-w-full"
            variant='outline'
            onClick={() => window.open(social.twitter, "_blank")}
          >
            <img src='/twitter_black.svg' className="bitte-theme-icon bitte-h-5 bitte-w-5" />
          </Button>
          <Button
            className="bitte-w-full"
            variant='outline'
            onClick={() => window.open(social.telegram, "_blank")}
          >
            <img src='/telegram_black.svg' className="bitte-theme-icon bitte-h-5 bitte-w-5" />
          </Button>
          <Button
            className="bitte-w-full"
            variant='outline'
            onClick={() => window.open(social.facebook, "_blank")}
          >
            <img src='/facebook_black.svg' className="bitte-theme-icon bitte-h-5 bitte-w-5" />
          </Button>
        </div>
        <DrawerFooter className="bitte-gap-4 bitte-border-t bitte-border-shad-gray-20 bitte-p-4">
          <div>
            <Button className="bitte-w-full" onClick={handleCopyLink}>
              {showLinkCopiedText ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ShareModal;
