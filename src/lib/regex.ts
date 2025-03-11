export const isMarkdownTableString = (message: string) => {
  // Match a line that starts with a pipe (|)and includes at least one more pipe
  const regex = /^\|.*\|.*$/gm;

  return regex.test(message);
};

export const isDataString = (str: string): boolean => {
  const cleaned = str
    .replace(/\\n/g, '') // Remove escaped newlines
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/['"]/g, '') // Remove quotes
    .trim();

  // Match a string that starts with {, [, or contains :
  const regex = /^\s*[{\[]|:\s*/;
  return regex.test(cleaned);
};
