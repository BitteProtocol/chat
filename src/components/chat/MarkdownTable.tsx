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
    <Table className='mt-4 w-full'>
      <TableHeader>
        <TableRow className='border-none hover:bg-transparent'>
          {cells[0].map((header, index) => (
            <TableHead
              key={index}
              className='whitespace-nowrap px-4 text-left text-[12px] font-medium'
            >
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {cells.slice(1).map((row, rowIndex) => (
          <TableRow key={rowIndex} className='border-none hover:bg-transparent'>
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
                  className='whitespace-nowrap px-4 text-left'
                >
                  <div className='max-w-[250px] break-words'>
                    {linkValue ? (
                      <a href={linkValue} target='_blank'>
                        <Button
                          variant='ghost'
                          className='flex items-center gap-2 p-0 text-shad-blue-100 hover:text-shad-blue-100'
                        >
                          View
                          <ArrowUpRight className='h-4 w-4' />
                        </Button>
                      </a>
                    ) : imageMatch ? (
                      <div className='relative h-24 w-24'>
                        <img
                          src={`${IMAGE_API}${imageValue}`}
                          alt={`result-${cellIndex}`}
                        />
                      </div>
                    ) : (
                      <div className='truncate'>{cell}</div>
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
