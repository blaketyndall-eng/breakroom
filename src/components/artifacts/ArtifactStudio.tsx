import { useState, useEffect } from 'react';
import type { ArtifactType, ArtifactPromptTemplate } from '@/content/data/artifactPromptTemplates';
import {
  getTemplates,
  getAvailableFactions,
  getAvailableStuff,
  generateFactionPrompt,
  generateStuffPrompt,
  generateManualPrompt,
  savePromptLocally,
  getSavedPrompts,
} from '@/lib/artifactPrompts';
import type { ArtifactPromptResult, ArtifactPromptSource } from '@/lib/artifactPrompts';
import ArtifactPromptCard from './ArtifactPromptCard';
import ArtifactTypeSelector from './ArtifactTypeSelector';

export default function ArtifactStudio() {
  const [templates] = useState(() => getTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<ArtifactPromptTemplate | null>(null);
  const [source, setSource] = useState<ArtifactPromptSource>('manual');
  const [sourceSlug, setSourceSlug] = useState('');
  const [manualInputs, setManualInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ArtifactPromptResult | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<ArtifactPromptResult[]>([]);

  const factions = getAvailableFactions();
  const stuff = getAvailableStuff();

  useEffect(() => {
    setSavedPrompts(getSavedPrompts());
  }, []);

  function handleTemplateSelect(slug: string) {
    const t = templates.find((tmpl) => tmpl.slug === slug) ?? null;
    setSelectedTemplate(t);
    setResult(null);
    setManualInputs({});
    setSourceSlug('');
  }

  function handleGenerate() {
    if (!selectedTemplate) return;

    let generated: ArtifactPromptResult | null = null;

    if (source === 'faction' && sourceSlug) {
      generated = generateFactionPrompt(sourceSlug, selectedTemplate.slug);
    } else if (source === 'stuff_item' && sourceSlug) {
      const item = stuff.find((s) => s.slug === sourceSlug);
      if (item) {
        // We need the full item — import inline from registry
        generated = generateManualPrompt(selectedTemplate.slug, {
          stuffName: item.name,
          stuffDescription: manualInputs.stuffDescription || '',
          priceLabel: manualInputs.priceLabel || 'NO PRICE FILED',
          ...manualInputs,
        });
      }
    } else {
      generated = generateManualPrompt(selectedTemplate.slug, manualInputs);
    }

    if (generated) {
      setResult(generated);
    }
  }

  function handleSave() {
    if (!result) return;
    savePromptLocally(result);
    setSavedPrompts(getSavedPrompts());
  }

  function handleInputChange(key: string, value: string) {
    setManualInputs((prev) => ({ ...prev, [key]: value }));
  }

  const sourceOptions: { value: ArtifactPromptSource; label: string }[] = [
    { value: 'manual', label: 'Manual / Custom' },
    { value: 'faction', label: 'From Faction' },
    { value: 'stuff_item', label: 'From Stuff Item' },
  ];

  return (
    <div className="artifact-studio">
      <div className="studio-controls">
        <div className="studio-step">
          <h3>1. Choose Artifact Type</h3>
          <ArtifactTypeSelector
            templates={templates}
            selected={selectedTemplate?.slug ?? null}
            onSelect={handleTemplateSelect}
          />
        </div>

        {selectedTemplate && (
          <div className="studio-step">
            <h3>2. Choose Source</h3>
            <div className="source-selector">
              {sourceOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`old-button source-button ${source === opt.value ? 'source-active' : ''}`}
                  onClick={() => { setSource(opt.value); setSourceSlug(''); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {source === 'faction' && (
              <select
                className="studio-select"
                value={sourceSlug}
                onChange={(e) => setSourceSlug(e.target.value)}
              >
                <option value="">— pick faction —</option>
                {factions.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.name}</option>
                ))}
              </select>
            )}

            {source === 'stuff_item' && (
              <select
                className="studio-select"
                value={sourceSlug}
                onChange={(e) => setSourceSlug(e.target.value)}
              >
                <option value="">— pick stuff item —</option>
                {stuff.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {selectedTemplate && (
          <div className="studio-step">
            <h3>3. Fill Details</h3>
            <div className="studio-inputs">
              {selectedTemplate.requiredInputs.map((input) => (
                <div className="studio-input-row" key={input}>
                  <label>{input.replaceAll(/([A-Z])/g, ' $1').toLowerCase()}</label>
                  <input
                    type="text"
                    value={manualInputs[input] ?? ''}
                    onChange={(e) => handleInputChange(input, e.target.value)}
                    placeholder={`enter ${input.replaceAll(/([A-Z])/g, ' $1').toLowerCase()}`}
                    disabled={source === 'faction' && ['factionName', 'factionDescription', 'factionColors', 'factionSymbols', 'turfDistrict', 'motto'].includes(input)}
                  />
                </div>
              ))}
              {selectedTemplate.optionalInputs?.map((input) => (
                <div className="studio-input-row" key={input}>
                  <label>{input.replaceAll(/([A-Z])/g, ' $1').toLowerCase()} <span className="optional-tag">(optional)</span></label>
                  <input
                    type="text"
                    value={manualInputs[input] ?? ''}
                    onChange={(e) => handleInputChange(input, e.target.value)}
                    placeholder={`optional: ${input.replaceAll(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <button className="old-button generate-button" onClick={handleGenerate}>
              Generate Prompt
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="studio-result">
          <ArtifactPromptCard result={result} onSave={handleSave} />
        </div>
      )}

      {savedPrompts.length > 0 && (
        <div className="studio-saved">
          <h3>Saved Prompts ({savedPrompts.length})</h3>
          <div className="saved-prompt-list">
            {savedPrompts.slice(0, 5).map((saved, i) => (
              <ArtifactPromptCard key={i} result={saved} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
