import type { ArtifactPromptTemplate } from '@/content/data/artifactPromptTemplates';

type Props = {
  templates: ArtifactPromptTemplate[];
  selected: string | null;
  onSelect: (slug: string) => void;
};

export default function ArtifactTypeSelector({ templates, selected, onSelect }: Props) {
  return (
    <div className="artifact-type-grid">
      {templates.map((template) => (
        <button
          key={template.slug}
          className={`artifact-type-card ${selected === template.slug ? 'type-selected' : ''}`}
          onClick={() => onSelect(template.slug)}
          title={template.description}
        >
          <span className="type-card-name">{template.title}</span>
          <span className="type-card-desc">{template.description}</span>
        </button>
      ))}
    </div>
  );
}
