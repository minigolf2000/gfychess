import { useState } from "react";

export function CopyToClipboard({
  text,
  children,
}: {
  text: () => string;
  children?: React.ReactNode;
}) {
  const [copyingState, setCopyingState] = useState<
    "uncopied" | "copying" | "copied"
  >("uncopied");

  return (
    <span
      className="cursor-pointer hover:underline"
      onClick={async () => {
        setCopyingState("copying");
        await navigator.clipboard.writeText(text());
        setCopyingState("copied");
        setTimeout(() => setCopyingState("uncopied"), 3_000);
      }}
      data-tooltip={copyingState === "copied" ? "Copied!" : "Copy to clipboard"}
    >
      {children}
    </span>
  );
}
