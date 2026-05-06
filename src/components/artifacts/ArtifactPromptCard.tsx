import { useState } from 'react';
import type { ArtifactPromptResult } from '@/lib/artifactPrompts';

type Props = {
  result: ArtifactPromptResult;
  onSave?: () => void;
  compact?: boolean;
};

export default function ArtifactPromptCard({ result, onSave, compact }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select text
      const textarea = document.createElement('textarea');
      textarea.value = result.prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (compact) {
    return (
      <div className="prompt-card prompt-card-compact">
        <div className="prompt-card-header">
          <span className="prompt-card-type">{result.type.replaceAll('_', ' ')}</span>
          <span className="prompt-card-title">{result.title}</span>
        </div>
        <button className="old-button copy-button" onClick={handleCopy}>
          {copied ? 'Copied.' : 'Copy'}
        </button>
      </div>
    );
  }

  return (
    <div className="prompt-card">
      <div className="prompt-card-header">
        <span className="prompt-card-type">{result.type.replaceAll('_', ' ')}</span>
        <h3 className="prompt-card-title">{result.title}</h3>
        {result.sourceSlug && (
          <span className="prompt-card-source">source: {result.source} / {result.sourceSlug}</span>
        )}
      </div>
      <pre className="prompt-card-body">{result.prompt}</pre>
      <div className="prompt-card-actions">
        <button className="old-button copy-button" onClick={handleCopy}>
          {copied ? 'Copied to clipboard.' : result.copyLabel}
        </button>
        {onSave && (
          <button className="old-button save-button" onClick={onSave}>
            Save Locally
          </button>
        )}
      </div>
    </div>
  );
}
