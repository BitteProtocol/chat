import React from "react";
import { Badge } from "../../ui/badge";

const TxnBadge = ({ transactionType }: { transactionType: string }) => {
  let styleClass = "";
  let displayName = "";

  switch (transactionType) {
    case "nft_batch_mint":
    case "mint":
      styleClass = "bitte:bg-shad-white-10 bitte:text-shad-slate-20";
      displayName = "Mint";
      break;
    case "nft_transfer":
      styleClass = "bitte:bg-shad-bg-light-blue-10 bitte:text-shad-blue-100";
      displayName = "Transfer";
      break;
    case "nft_approve":
      styleClass = "bitte:bg-light-purple bitte:text-purple-100";
      displayName = "List";
      break;
    case "nft_batch_burn":
      styleClass = "bitte:bg-shad-error-5 bitte:text-shad-error";
      displayName = "Burn";
      break;
    case "buy":
      styleClass = "bitte:bg-shad-light-green bitte:text-shad-green-20";
      displayName = "Buy";
      break;
    case "ft_transfer":
    case "Send":
      styleClass = "bitte:bg-shad-light-green bitte:text-shad-green-20";
      displayName = "Send";
      break;
    default: // Default styles
      styleClass = "bitte:bg-shad-white-10 bitte:text-shad-slate-20";
      displayName = transactionType; // Default to raw transaction type if not matched
  }

  return <Badge className={`bitte:px-2 ${styleClass}`}>{displayName}</Badge>;
};

export default TxnBadge;
