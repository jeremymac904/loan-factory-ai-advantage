'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  ImageIcon,
  Send,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import { currentUserProfile } from '@/lib/platform-mock-data';
import { LOAN_FACTORY_COMPANY_NMLS } from '@/lib/compliance-rules';

type ChatRole = 'user' | 'twin';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  at: string;
}

const SUGGESTED_PROMPTS = [
  'Write a Realtor follow-up post in my voice',
  'Create a first-time buyer reel script',
  'Turn this idea into a compliant LinkedIn post',
  'Create a Spanish version of this caption',
  'Create a VA buyer education post',
  'Give me a 30-second video script',
  "Help me explain why brokers have more options than banks",
];

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Demo-mode AI Twin generator. Deterministic, runs entirely client-side.
// When MiniMax is wired, this becomes a POST to /api/ai/generate with task
// 'agent-response' and agent 'ai-twin'.
function twinReply(prompt: string, persona: string, loName: string, loNmls: string): string {
  const lower = prompt.toLowerCase();

  const compliance = `${loName}, NMLS #${loNmls} · Loan Factory, NMLS #${LOAN_FACTORY_COMPANY_NMLS} · Equal Housing Lender.`;
  const draftLabel = '[Draft — requires Marketing Review · never auto-posted]';

  // Pick a body based on intent
  let body: string;
  if (lower.includes('realtor')) {
    body = `Great Realtor follow-up. Hook with the borrower problem (timing, pre-approval confidence, builder lender vs. broker). Two-line proof point. Soft CTA — "Want to grab 15 minutes this week?"\n\nDraft:\n\n"Hey [Name] — thanks for sending [Buyer]'s contact over. Quick note: we pre-approve through 60+ wholesale lender partners, not one bank desk. That usually means more programs and a sharper rate for your buyer. Want to compare against whatever they were quoted? I'll have apples-to-apples numbers in 24 hours."`;
  } else if (lower.includes('first-time') || lower.includes('first time') || lower.includes('reel')) {
    body = `30-second reel script for first-time buyers:\n\n[Hook, 3s] "If you're a first-time buyer and you've been told you need 20% down — read this."\n\n[Beat, 8s] FHA: 3.5% down. Conventional 97: 3% down. VA + USDA: 0% down for qualifying buyers.\n\n[Beat, 8s] What actually matters: stable income, credit score, and one honest conversation about the math.\n\n[CTA, 6s] "DM me 'INFO' — I'll walk you through your specific situation."\n\n[End card] Loan Factory wordmark + NMLS + Equal Housing Lender.`;
  } else if (lower.includes('linkedin')) {
    body = `LinkedIn-ready rewrite:\n\nMost loan officers know one bank's pricing engine. Wholesale brokers have access to 60+ wholesale lender partners — and that's why my clients usually walk in with more options than a retail bank can offer.\n\nThree things that change for you when you work with a broker:\n\n1. More program options for non-traditional income\n2. Pricing comparisons across lenders, not against one menu\n3. A single application that gets shopped on your behalf\n\nIf you're sitting on a "what if I qualify for more" question, that's a conversation worth having.`;
  } else if (lower.includes('spanish') || lower.includes('español') || lower.includes('en espanol')) {
    body = `Spanish-language version:\n\n"¿Eres comprador por primera vez? Te dijeron que necesitas 20% de enganche — eso casi nunca es verdad.\n\nFHA: 3.5%. Préstamo convencional: desde 3%. VA y USDA: 0% para quienes califican.\n\nLo que sí importa: ingresos estables, crédito, y una conversación honesta sobre los números. Hablemos."\n\n(Tone matches Spanish-speaking first-time buyer audience. Plain, family-first, no jargon.)`;
  } else if (lower.includes('va')) {
    body = `VA buyer education post:\n\nVeterans — your VA benefit covers ZERO DOWN on a primary residence. No PMI. Competitive wholesale rates through Loan Factory's lender partners.\n\nThree things most veterans don't realize:\n\n1. You can use your VA benefit more than once.\n2. Disability rating waives the VA funding fee.\n3. You don't have to "save up" — VA is built specifically for this.\n\nIf you served and you're sitting on a question about VA — DM "VA" and I'll walk you through it personally.`;
  } else if (lower.includes('video') || lower.includes('script')) {
    body = `30-second video script (talking head + b-roll):\n\n[0:00–0:03] Hook: "Three myths about ${prompt.length < 40 ? 'wholesale brokers' : prompt.slice(0, 30)} — debunked in 30 seconds."\n\n[0:03–0:10] Myth 1 — and the actual answer.\n[0:10–0:18] Myth 2 — and the actual answer.\n[0:18–0:25] Myth 3 — and the actual answer.\n[0:25–0:30] CTA: "DM me 'INFO' and I'll send you the real breakdown."\n\nSub-titles required. End card: Loan Factory wordmark + your NMLS + Equal Housing Lender.`;
  } else if (lower.includes('broker') && lower.includes('bank')) {
    body = `Plain-English wholesale-broker vs. bank explainer:\n\n• A bank loan officer shops one menu — their bank's.\n• A wholesale broker (me) shops 60+ wholesale lender partners with one application.\n• Same borrower, same file: different lenders price differently. The broker path almost always wins on options and price.\n\nThat's it. That's the difference. The bank's incentive is to sell THEIR loan; mine is to find the right one for you.`;
  } else {
    body = `Here's a starting draft based on your prompt:\n\n"${prompt}"\n\nReframed in your voice (${persona || 'plainspoken, family-first'}):\n\nOpen with one specific scenario your audience recognizes. Land one number or one fact that contradicts what they were told. Close with a low-pressure CTA — "DM me 'INFO' and I'll walk you through your numbers."\n\nKeep it short. No superlatives. No rate quotes. No borrower data.`;
  }

  return `${draftLabel}\n\n${body}\n\n${compliance}`;
}

export default function AiTwinChatPage() {
  const u = currentUserProfile;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'seed',
      role: 'twin',
      text: `Hey ${u.preferred_display_name.split(' ')[0]} — I'm your AI Twin. I draft in your voice using your persona, approved topics, and Loan Factory compliance rules.\n\nEvery response is a Draft. Marketing reviews before publish. Pick a prompt below or ask me anything — short and specific works best.`,
      at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      text: trimmed,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    // Simulate a short think delay so the UX feels real. Replace with a server
    // action when MiniMax is wired — keep the same shape.
    setTimeout(() => {
      const reply: ChatMessage = {
        id: makeId(),
        role: 'twin',
        text: twinReply(
          trimmed,
          u.persona_summary ?? '',
          u.preferred_display_name,
          u.nmls_number,
        ),
        at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    }, 600);
  }

  const personaReady =
    !!u.persona_summary && !!u.profile_image_url && !!u.ai_reference_image_url;

  return (
    <>
      <Topbar
        title="AI Twin"
        subtitle="Drafts in your voice. Marketing reviews every output before publish. Demo mode — MiniMax wiring lands later."
      />

      <div className="px-5 sm:px-8 py-6 grid lg:grid-cols-4 gap-5 h-[calc(100vh-8rem)]">
        {/* Chat column */}
        <section className="lg:col-span-3 bg-white border border-[var(--color-lf-border)] rounded-2xl flex flex-col overflow-hidden">
          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user'
                      ? 'bg-[var(--color-lf-black)] text-white'
                      : 'bg-[var(--color-lf-orange)] text-white'
                  }`}
                >
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-1">
                    {m.role === 'user' ? u.preferred_display_name : 'AI Twin'}
                  </p>
                  <div
                    className={`inline-block text-left text-sm leading-relaxed whitespace-pre-line rounded-2xl px-4 py-3 ${
                      m.role === 'user'
                        ? 'bg-[var(--color-lf-black)] text-white'
                        : 'bg-[var(--color-lf-surface)] text-[var(--color-lf-black)] border border-[var(--color-lf-border)]'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-lf-orange)] text-white flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-2xl px-4 py-3 text-sm text-[var(--color-lf-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lf-orange)] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lf-orange)] animate-pulse delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lf-orange)] animate-pulse delay-200" />
                    Drafting…
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="px-5 sm:px-7 py-3 border-t border-gray-50 bg-[var(--color-lf-surface)]/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
                Try one of these
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="text-xs font-semibold text-[var(--color-lf-muted)] bg-white border border-[var(--color-lf-border)] hover:border-[var(--color-lf-orange)] hover:text-[var(--color-lf-orange-dark)] px-3 py-1.5 rounded-full transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[var(--color-lf-border)] px-5 sm:px-7 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask your AI Twin… (Enter to send, Shift+Enter for newline)"
                className="flex-1 bg-white border border-[var(--color-lf-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)] resize-none max-h-32"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] disabled:bg-gray-300 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors shadow-sm shadow-[var(--color-lf-orange)]/20"
              >
                <Send size={14} /> Send
              </button>
            </form>
            <p className="text-[10px] text-[var(--color-lf-muted)] mt-2 leading-relaxed">
              Every response is a <span className="font-bold">Draft</span>, requires{' '}
              <span className="font-bold">Marketing review</span>, and is{' '}
              <span className="font-bold">never auto-posted</span>. Do not paste borrower data,
              loan numbers, credit info, or income docs.
            </p>
          </div>
        </section>

        {/* Right rail */}
        <aside className="lg:col-span-1 space-y-4 overflow-y-auto">
          {/* Persona status */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
              Persona status
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  personaReady
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    personaReady ? 'bg-green-600' : 'bg-amber-500'
                  }`}
                />
                {personaReady ? 'Ready' : 'Setup needed'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-lf-muted)] leading-relaxed mb-3">
              {personaReady
                ? 'Your AI Twin is drafting using your persona, headshot, and AI reference image.'
                : "Add a persona summary, headshot, and AI reference image so I match your voice."}
            </p>
            <Link
              href="/profile#persona"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Manage in Profile <ArrowRight size={11} />
            </Link>
          </div>

          {/* Marketing review reminder */}
          <div className="bg-[var(--color-lf-orange-soft)] border border-orange-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[var(--color-lf-orange)]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)]">
                Marketing review
              </p>
            </div>
            <p className="text-xs text-[var(--color-lf-black)] leading-relaxed">
              Every draft from your AI Twin is marked <span className="font-bold">Needs Marketing Review</span>.
              Submit through Content Studio when you&apos;re ready.
            </p>
            <Link
              href="/content-studio"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Open Content Studio <ArrowRight size={11} />
            </Link>
          </div>

          {/* MiniMax status */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
              MiniMax provider
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-100">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Demo mode
            </span>
            <p className="text-xs text-[var(--color-lf-muted)] mt-2 leading-relaxed">
              Replies come from the local demo generator. Live MiniMax calls turn on when the
              server-side env is set and Marketing &amp; IT approve.
            </p>
          </div>

          {/* Safety reminder */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <ShieldAlert size={14} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-red-800 leading-relaxed">
                Never paste borrower documents, credit reports, income files, loan numbers, or
                non-public personal info into the chat.
              </p>
            </div>
          </div>

          {/* Image generation status */}
          <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={13} className="text-[var(--color-lf-muted)]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
                Image generation
              </p>
            </div>
            <p className="text-[11px] text-[var(--color-lf-muted)] leading-relaxed">
              Off until <code className="font-bold">AI_IMAGE_GENERATION_ENABLED=true</code>. Your AI
              reference image will be used as a likeness anchor when it&apos;s on.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
