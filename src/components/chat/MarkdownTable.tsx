import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BITTE_BLACK_IMG } from "../../lib/images";

const IMAGE_API =
  "https://image-cache-service-z3w7d7dnea-ew.a.run.app/media?url=";

export const MarkdownTable = ({ content }: { content: string }) => {
  // Split the markdown string into lines
  const lines = content.split("\n");

  // Filter out the lines that are part of the table
  const tableLines = lines.filter(
    (line) => line.startsWith("|") && !line.includes("---")
  );

  // Split each line into cells
  const cells = tableLines.map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim())
  );

  return (
    <Table className="bitte-mt-4 bitte-w-full">
      <TableHeader>
        <TableRow className="bitte-border-none bitte-hover:bg-transparent">
          {cells[0].map((header, index) => (
            <TableHead
              key={index}
              className="bitte-whitespace-nowrap bitte-px-4 bitte-text-left text-[12px] bitte-font-medium"
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {cells.slice(1).map((row, rowIndex) => (
          <TableRow key={rowIndex} className="bitte-border-none bitte-hover:bg-transparent">
            {row.map((cell, cellIndex) => {
              const linkMatchQuery = cell.match(/\[Link\]\((.*)\)/);
              const linkValue = linkMatchQuery?.[1];
              const imageMatchQuery = cell.match(/!\[.*\]\((.*)\)/);
              const imageMatch = imageMatchQuery?.[1];
              const imageValue = imageMatch?.startsWith("https://")
                ? imageMatch
                : BITTE_BLACK_IMG;

              return (
                <TableCell
                  key={cellIndex}
                  className="bitte-whitespace-nowrap bitte-px-4 bitte-text-left"
                >
                  <div className="max-w-[250px] bitte-break-words">
                    {linkValue ? (
                      <a href={linkValue} target='_blank'>
                        <Button
                          variant='ghost'
                          className="bitte-flex bitte-items-center bitte-gap-2 bitte-p-0 bitte-text-shad-blue-100 bitte-hover:text-shad-blue-100"
                        >
                          View
                          <ArrowUpRight className="bitte-h-4 bitte-w-4" />
                        </Button>
                      </a>
                    ) : imageMatch ? (
                      <div className="bitte-relative bitte-h-24 bitte-w-24">
                        <img
                          src={`${IMAGE_API}${imageValue}`}
                          alt={`result-${cellIndex}`}
                        />
                      </div>
                    ) : (
                      <div className="bitte-truncate">{cell}</div>
                    )}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
