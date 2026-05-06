import { useEffect, useState } from 'react';
import {
  generateAgentComment,
  getLocalAgentComments,
  AGENT_COMMENT_EVENT,
} from '@/lib/agentComments';
import type { AgentComment, AgentCommentTargetType, AgentCommentTrigger } from '@/lib/agentComments';
import type { SleepNetSiteType } from '@/lib/sleepnetGenerators';
import { getAgentBySlug } from '@/content/data/agents';

type Props = {
  targetType: AgentCommentTargetType;
  targetSlug: string;
  trigger?: AgentCommentTrigger;
  context?: { siteType?: SleepNetSiteType; factionSlug?: string; designLevel?: 1 | 2 | 3 | 4 };
  maxVisible?: number;
  autoGenerate?: boolean;
};

export default function AgentCommentBlock({
  targetType,
  targetSlug,
  trigger = 'page_visit',
  context,
  maxVisible = 3,
  autoGenerate = true,
}: Props) {
  const [comments, setComments] = useState<AgentComment[]>([]);

  useEffect(() => {
    // Load existing local comments
    setComments(getLocalAgentComments(targetType, targetSlug));

    // Auto-generate on first view if enabled
    if (autoGenerate) {
      const generated = generateAgentComment({
        targetType,
        targetSlug,
        trigger,
        context,
      });
      if (generated) {
        setComments((prev) => [...prev, generated]);
      }
    }

    // Listen for new comments
    const onComment = (e: Event) => {
      const detail = (e as CustomEvent<AgentComment>).detail;
      if (detail.targetType === targetType && detail.targetSlug === targetSlug) {
        setComments((prev) => [...prev, detail]);
      }
    };
    window.addEventListener(AGENT_COMMENT_EVENT, onComment);
    return () => window.removeEventListener(AGENT_COMMENT_EVENT, onComment);
  }, [targetType, targetSlug, trigger, autoGenerate]);

  const visible = comments.slice(-maxVisible);

  if (!visible.length) return null;

  return (
    <div className="agent-comment-block">
      <p className="agent-comment-block__header">Agent Activity</p>
      {visible.map((comment) => {
        const agent = getAgentBySlug(comment.agentSlug);
        return (
          <div key={comment.id} className={`agent-comment-block__entry agent-${comment.agentSlug}`}>
            <span className="agent-comment-block__name">
              @{agent?.name ?? comment.agentSlug}
            </span>
            <span className="agent-comment-block__body">{comment.body}</span>
            {comment.tone && (
              <span className="agent-comment-block__tone">{comment.tone}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
