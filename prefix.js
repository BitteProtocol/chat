const glob = require('glob');
const fs = require('fs');

const PREFIX = 'bitte-';
const filePattern = './src/**/*.tsx';

glob(filePattern, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    return;
  }

  files.forEach((file) => {
    fs.readFile(file, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(`Error reading file ${file}:`, readErr);
        return;
      }

       // Regex for detecting className patterns
       const updatedData = data.replace(
        /\bclass(Name)?=\{?cn\(([^)]*)\)\}?|\bclass(Name)?=["']([^"']*)["']/g,
        (match, p1, p2, p3, p4) => {
          if (p2) {
            // Handling cn(...) pattern
            const prefixedCnClasses = p2.replace(
              /"([^"]+)"/g,
              (_, classList) =>
                `"${classList
                  .split(/\s+/)
                  .map(cls => (cls.startsWith('!') || cls.includes('[') || cls.includes(']') ? cls : `${PREFIX}${cls}`))
                  .join(' ')}"`
            );
            return `className={cn(${prefixedCnClasses})}`;
          } else if (p4) {
            // Handling standard className="..." pattern
            const prefixedClasses = p4
              .split(/\s+/)
              .map(cls => (cls.startsWith('!') || cls.includes('[') || cls.includes(']') ? cls : `${PREFIX}${cls}`))
              .join(' ');
            return `className="${prefixedClasses}"`;
          }
          return match;
        }
      );

      fs.writeFile(file, updatedData, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file ${file}:`, writeErr);
        } else {
          console.log(`Updated file: ${file}`);
        }
      });
    });
  });
});
