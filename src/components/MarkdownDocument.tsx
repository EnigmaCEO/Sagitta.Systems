import type { ReactNode } from "react";

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; columns: string[]; rows: string[][] };

/** Small, intentionally bounded renderer for the Markdown authored in Defense reviews. */
export default function MarkdownDocument({ source }: { source: string }) {
  const blocks = parse(source);

  return (
    <div className="defense-document">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          const id = slugify(block.text);
          return block.level <= 2 ? (
            <h2 key={`${id}-${index}`} id={id}>
              <Inline text={block.text} />
            </h2>
          ) : (
            <h3 key={`${id}-${index}`} id={id}>
              <Inline text={block.text} />
            </h3>
          );
        }

        if (block.kind === "paragraph") {
          return (
            <p key={`${index}-${block.text.slice(0, 32)}`}>
              <Inline text={block.text} />
            </p>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={`table-${index}`} className="defense-table-wrap">
            <table>
              <thead>
                <tr>
                  {block.columns.map((cell) => (
                    <th key={cell} scope="col">
                      <Inline text={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`${rowIndex}-${row.join("-")}`}>
                    {row.map((cell, cellIndex) => {
                      const Cell = cellIndex === 0 ? "th" : "td";
                      return (
                        <Cell key={`${cellIndex}-${cell}`} {...(cellIndex === 0 ? { scope: "row" } : {})}>
                          <Inline text={cell} />
                        </Cell>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  // The route owns the document title; do not repeat the source H1 in the body.
  if (lines[0]?.startsWith("# ")) index = 1;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (line.startsWith("|") && isDivider(lines[index + 1])) {
      const columns = cells(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(cells(lines[index]));
        index += 1;
      }
      blocks.push({ kind: "table", columns, rows });
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ""));
        index += 1;
      }
      blocks.push({ kind: "list", items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || /^(#{1,3})\s+/.test(next) || /^-\s+/.test(next)) break;
      if (next.startsWith("|") && isDivider(lines[index + 1])) break;
      paragraph.push(next);
      index += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function isDivider(line?: string): boolean {
  return Boolean(line?.trim().match(/^\|(?:\s*:?-{3,}:?\s*\|)+$/));
}

function cells(line: string): string[] {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function slugify(value: string): string {
  return value
    .replace(/[*`]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Inline({ text }: { text: string }) {
  const token = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(token)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));
    const value = match[0];
    const key = `${start}-${value}`;

    if (value.startsWith("**")) {
      parts.push(<strong key={key}>{value.slice(2, -2)}</strong>);
    } else if (value.startsWith("`")) {
      parts.push(<code key={key}>{value.slice(1, -1)}</code>);
    } else if (value.startsWith("[")) {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        parts.push(
          <a key={key} href={link[2]} target="_blank" rel="noopener noreferrer">
            {link[1].replace(/^\*|\*$/g, "")}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>,
        );
      }
    } else {
      parts.push(<em key={key}>{value.slice(1, -1)}</em>);
    }
    cursor = start + value.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}
