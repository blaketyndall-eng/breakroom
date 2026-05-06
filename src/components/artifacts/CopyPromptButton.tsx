import { useState } from 'react';

type Props = {
  text: string;
  label?: string;
};

export default function CopyPromptButton({ text, label = 'Copy Prompt' }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button className="old-button copy-button" onClick={handleCopy}>
      {copied ? 'Copied.' : label}
    </button>
  );
}
