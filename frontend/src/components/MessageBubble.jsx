import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function MessageBubble({ message, index = 0 }) {
  const isAI = message.sender === 'ai';
  // Stagger delay: cap at 6 messages so old messages don't lag
  const delayMs = Math.min(index, 6) * 60;

  const formatInlineMarkdown = (text) => {
    if (!text) return '';
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  // ─── Table Renderer ────────────────────────────────────────────────────
  const renderTable = (tableLines, tableKey) => {
    if (tableLines.length < 2) return null;
    const parseRow = (rowText) => {
      const parts = rowText.split('|').map(p => p.trim());
      return parts.slice(1, parts.length - 1);
    };
    const headers = parseRow(tableLines[0]);
    const hasSeparator = tableLines[1] && tableLines[1].includes('---');
    const dataStartIndex = hasSeparator ? 2 : 1;
    const dataRows = tableLines.slice(dataStartIndex).map(parseRow);
    return (
      <div key={tableKey} className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-2.5 text-left font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 last:border-r-0" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(h) }} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {dataRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="px-4 py-2.5 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 last:border-r-0" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ─── Standard Markdown Renderer ───────────────────────────────────────
  const parseMessageText = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        elements.push(renderTable(tableLines, `table-${i}`));
        continue;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const listItems = [];
        const key = `list-${i}`;
        while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
          listItems.push(lines[i].trim().substring(2));
          i++;
        }
        elements.push(
          <ul key={key} className="list-disc pl-5 space-y-1 my-2">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        );
        continue;
      }
      if (/^\d+\.\s/.test(line)) {
        const listItems = [];
        const key = `ol-${i}`;
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={key} className="list-decimal pl-5 space-y-1 my-2">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ol>
        );
        continue;
      }
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={`h4-${i}`} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.substring(5)) }} />);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={`h3-${i}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.substring(4)) }} />);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={`h2-${i}`} className="text-base font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2.5" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.substring(3)) }} />);
      } else if (line === '---') {
        elements.push(<hr key={`hr-${i}`} className="my-3 border-slate-200 dark:border-slate-700" />);
      } else if (line) {
        elements.push(<p key={`p-${i}`} className="mb-2 min-h-[1rem]" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />);
      } else {
        elements.push(<div key={`br-${i}`} className="h-2" />);
      }
      i++;
    }
    return elements;
  };

  // ─── Stage 2 Career Card Renderer ─────────────────────────────────────
  const SECTION_CONFIG = [
    { key: 'desc',       emoji: '📋', label: 'Mô tả công việc',      color: 'blue'   },
    { key: 'day',        emoji: '🌅', label: 'Một ngày làm việc',     color: 'amber'  },
    { key: 'salary',     emoji: '💰', label: 'Mức lương',             color: 'green'  },
    { key: 'prospects',  emoji: '🚀', label: 'Triển vọng',            color: 'purple' },
    { key: 'skills',     emoji: '🛠️', label: 'Kỹ năng cần có',       color: 'orange' },
    { key: 'jobs',       emoji: '🏢', label: 'Cơ hội việc làm',       color: 'teal'   },
    { key: 'core',       emoji: '📌', label: 'Khía cạnh cốt lõi',     color: 'rose'   },
  ];

  const COLOR_MAP = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-blue-200 dark:border-blue-800',     label: 'text-blue-700 dark:text-blue-300'     },
    amber:  { bg: 'bg-amber-50 dark:bg-amber-950/30',   border: 'border-amber-200 dark:border-amber-800',   label: 'text-amber-700 dark:text-amber-300'   },
    green:  { bg: 'bg-green-50 dark:bg-green-950/30',   border: 'border-green-200 dark:border-green-800',   label: 'text-green-700 dark:text-green-300'   },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', label: 'text-purple-700 dark:text-purple-300' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', label: 'text-orange-700 dark:text-orange-300' },
    teal:   { bg: 'bg-teal-50 dark:bg-teal-950/30',     border: 'border-teal-200 dark:border-teal-800',     label: 'text-teal-700 dark:text-teal-300'     },
    rose:   { bg: 'bg-rose-50 dark:bg-rose-950/30',     border: 'border-rose-200 dark:border-rose-800',     label: 'text-rose-700 dark:text-rose-300'     },
  };

  const CAREER_GRADIENTS = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-emerald-500 to-teal-400',
    'from-orange-500 to-amber-400',
    'from-rose-500 to-pink-400',
  ];

  const extractSection = (raw, emojiHint) => {
    const escaped = emojiHint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`####\\s*${escaped}[^\\n]*\\n([\\s\\S]*?)(?=####|⚖️|$)`);
    const m = raw.match(re);
    return m ? m[1].trim() : '';
  };

  const parseCareerData = (raw) => ({
    desc:      extractSection(raw, '📋'),
    day:       extractSection(raw, '🌅'),
    salary:    extractSection(raw, '💰'),
    prospects: extractSection(raw, '🚀'),
    skills:    extractSection(raw, '🛠️'),
    jobs:      extractSection(raw, '🏢'),
    core:      extractSection(raw, '📌'),
    verdict:   (() => {
      const m = raw.match(/⚖️\s*\*\*Phán quyết sơ bộ:\*\*\s*\*\*(.+?)\*\*/);
      return m ? m[1].trim() : '';
    })(),
  });

  const SkillGapChart = ({ data }) => {
    // data = "Python:10|SQL:10|Power BI:0|Excel nâng cao:5|Statistics:2"
    const skills = data.split('|').map(item => {
      const parts = item.split(':');
      return { name: parts[0]?.trim() || '', level: parseInt(parts[1]) || 0 };
    }).filter(s => s.name);

    return (
      <div className="mt-1 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
          Phân tích khoảng cách kỹ năng
        </p>
        <div className="space-y-2">
          {skills.map(({ name, level }) => {
            const pct = (level / 10) * 100;
            const isHave    = level >= 8;
            const isPartial = level >= 3 && level < 8;
            const barColor  = isHave    ? 'bg-emerald-500'                : isPartial ? 'bg-amber-400'               : 'bg-rose-400';
            const trackColor= isHave    ? 'bg-emerald-100 dark:bg-emerald-900/30' : isPartial ? 'bg-amber-100 dark:bg-amber-900/30'  : 'bg-rose-50 dark:bg-rose-900/20';
            const icon      = isHave    ? '✔'  : isPartial ? '◑'  : '✗';
            const iconColor = isHave    ? 'text-emerald-600 dark:text-emerald-400' : isPartial ? 'text-amber-500 dark:text-amber-400'   : 'text-rose-500 dark:text-rose-400';
            const nameColor = isHave    ? 'text-slate-700 dark:text-slate-200'     : 'text-slate-500 dark:text-slate-400';

            return (
              <div key={name} className="flex items-center gap-2.5">
                <span className={`w-[110px] text-[12px] font-medium flex-shrink-0 truncate ${nameColor}`} title={name}>
                  {name}
                </span>
                <div className={`flex-1 h-3 rounded-full ${trackColor} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                    style={{ width: pct > 0 ? `${Math.max(pct, 8)}%` : '0%' }}
                  />
                </div>
                <span className={`text-[11px] font-bold flex-shrink-0 w-4 text-center ${iconColor}`}>{icon}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
            Đã có
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block flex-shrink-0" />
            Cơ bản
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block flex-shrink-0" />
            Chưa có
          </span>
        </div>
      </div>
    );
  };

  const SectionContent = ({ text }) => {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim());
    return (
      <div className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {lines.map((line, i) => {
          const t = line.trim();
          // ── Skill gap progress bar ──────────────────────────
          if (t.startsWith('SKILLGAP::')) {
            return <SkillGapChart key={i} data={t.substring(10)} />;
          }
          if (t.startsWith('* ') || t.startsWith('- ')) {
            return (
              <div key={i} className="flex gap-2 items-start">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-40" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(t.substring(2)) }} />
              </div>
            );
          }
          return <p key={i} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(t) }} />;
        })}
      </div>
    );
  };

  const CareerCard = ({ raw, index }) => {
    const [open, setOpen] = useState(true);
    const nameMatch = raw.match(/###.*?Nghề nghiệp thứ \d+:?\s*\*\*(.+?)\*\*/);
    const name = nameMatch ? nameMatch[1] : `Nghề ${index + 1}`;
    const data = parseCareerData(raw);
    const gradient = CAREER_GRADIENTS[index % CAREER_GRADIENTS.length];

    return (
      <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mb-5 bg-white dark:bg-slate-900">
        {/* Card Header */}
        <div
          className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center justify-between cursor-pointer select-none`}
          onClick={() => setOpen(o => !o)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-white font-extrabold text-lg shadow-inner flex-shrink-0">
              {index + 1}
            </div>
            <div className="min-w-0">
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Nghề nghiệp thứ {index + 1}</p>
              <h3 className="text-white font-bold text-[15px] leading-snug truncate">{name}</h3>
            </div>
          </div>
          <div className="text-white/80 ml-3 flex-shrink-0">
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {/* Card Body */}
        {open && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {SECTION_CONFIG.map(({ key, emoji, label, color }) => {
              const content = data[key];
              if (!content) return null;
              const c = COLOR_MAP[color];
              return (
                <div key={key} className={`rounded-xl border ${c.border} ${c.bg} p-3.5`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[16px] leading-none">{emoji}</span>
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${c.label}`}>{label}</span>
                  </div>
                  <SectionContent text={content} />
                </div>
              );
            })}

            {/* Verdict Banner */}
            {data.verdict && (
              <div className="md:col-span-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-950 p-4 flex items-center gap-4 shadow-inner">
                <span className="text-3xl flex-shrink-0">⚖️</span>
                <div>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Phán quyết sơ bộ</p>
                  <p className="text-white font-semibold text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(data.verdict) }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const tryRenderCareerCards = (text) => {
    if (!text.includes('💼 Nghề nghiệp thứ')) return null;
    const allParts = text.split(/\n---\n/);
    const intro = allParts[0];
    const careerBlocks = allParts.slice(1).filter(b => b.includes('💼 Nghề nghiệp thứ'));
    const last = allParts[allParts.length - 1];
    const hasOutro = careerBlocks.length > 0 && !last.includes('💼 Nghề nghiệp thứ') && last !== intro;

    return (
      <div>
        <div className="mb-5 text-sm leading-relaxed">
          {parseMessageText(intro)}
        </div>
        {careerBlocks.map((block, idx) => (
          <CareerCard key={idx} raw={block} index={idx} />
        ))}
        {hasOutro && (
          <div className="mt-2 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
            {parseMessageText(last)}
          </div>
        )}
      </div>
    );
  };

  const careerCards = isAI ? tryRenderCareerCards(message.text) : null;

  return (
    <div
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4 ${isAI ? 'msg-ai' : 'msg-user'}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className={`max-w-[92%] md:max-w-[85%] rounded-2xl p-4 shadow-sm ${
        isAI
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
          : 'bg-primary-600 text-white rounded-tr-none'
      }`}>
        <div className="text-sm md:text-base leading-relaxed">
          {careerCards || parseMessageText(message.text)}
        </div>
      </div>
    </div>
  );
}

