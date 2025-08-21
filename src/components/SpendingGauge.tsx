import { useEffect, useRef, useState } from 'react';

interface SpendingGaugeProps {
  percentage: number; // raw percentage (can exceed 100)
  amount: number;
  limit: number;
  date: string;
  topCategory?: { category: { name: string; iconKey: string }; amount: number } | null;
}

export function SpendingGauge({ percentage, amount, limit, date, topCategory }: SpendingGaugeProps) {
  // Clamp the visual arc to 0–100 so the semicircle always represents 0–100%.
  const visualPercent = Math.min(100, Math.max(0, percentage));

  // Color thresholds (requested):
  // <50%  => green (success)
  // >50% & <70% => light red (warning)
  // >=70% => red (danger)
  const getStatus = () => {
    if (percentage >= 70) return 'danger';
    if (percentage > 50) return 'warning';
    return 'success';
  };
  const status = getStatus();
  const textColor = `text-${status}`; // relies on existing utility classes

  // Gauge geometry (full circle)
  const size = 180; // svg width/height
  const strokeWidth = 12;
  const radius = (size / 2) - (strokeWidth / 2); // keep stroke fully inside viewbox
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (visualPercent / 100) * circumference;

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatCurrency = (amt: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amt);

  // Preserve original multi-color scheme for speedometer
  const strokeColor =
    status === 'success'
      ? 'hsl(var(--gauge-success-color))'
      : status === 'warning'
        ? 'hsl(var(--gauge-warning-color))'
        : 'hsl(var(--gauge-danger-color))';

  // Dynamic aura background behind the gauge circle center
  const auraVar = status === 'success'
    ? '--gauge-success-color'
    : status === 'warning'
      ? '--gauge-warning-color'
      : '--gauge-danger-color';
  const auraStyle: React.CSSProperties = {
    background: `radial-gradient(circle at 35% 30%, hsl(var(${auraVar}) / 0.40), transparent 72%)`
  };

  // Tooltip feedback logic
  const feedback = (() => {
    const parts: string[] = [];
    if (percentage < 50) parts.push('Great pace ✅');
    else if (percentage < 70) parts.push('Moderate spending ➡️');
    else if (percentage < 100) parts.push('Getting close ⚠️');
    else parts.push('Limit exceeded ❌');
    if (topCategory) {
      const catPct = Math.round((topCategory.amount / amount) * 100);
      parts.push(`${topCategory.category.name} is top (${catPct}%).`);
    }
    return parts.join(' ');
  })();

  return (
    <div className="flex flex-col w-full items-start space-y-4 py-6 pl-4">
      <div className="flex items-center gap-8">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            <defs>
              {/* Background gradient matching supplied pale yellow -> mint image */}
              <radialGradient id="gaugeBg" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#FFFFF2" />
                <stop offset="55%" stopColor="#FAFFE2" />
                <stop offset="100%" stopColor="#E8F8CC" />
              </radialGradient>
            </defs>
            <g className="-rotate-90 origin-center">
              {/* Filled background disc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius - strokeWidth * 0.55}
                fill="url(#gaugeBg)"
                stroke="none"
              />
              {/* Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
              />
              {/* Progress arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-3xl font-bold currency ${textColor} drop-shadow-sm`}>{percentage}%</div>
            <div className="text-xs text-muted-foreground mt-1">of daily limit</div>
          </div>
          <div
            className="absolute -inset-2 rounded-full blur-md animate-pulse pointer-events-none"
            style={auraStyle}
          />
        </div>
        <div className="flex items-center justify-center text-5xl group relative">
          <span className="animate-bounce cursor-help relative" role="img" aria-label="assistant">
            <span className="absolute -inset-3 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--success)/0.35),transparent_70%)] blur opacity-60 animate-ping" />
            🤖
          </span>
          <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition duration-200">
            <div className="relative bg-popover/95 backdrop-blur-md text-popover-foreground text-sm leading-relaxed rounded-lg shadow-lg border px-4 py-3 max-w-[260px] w-[230px] text-left whitespace-normal break-words">
              {/* Arrow */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover/95 border-l border-t border-border rotate-45 rounded-[2px]" />
              {feedback}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center space-y-1 self-center">
        <div className={`text-lg font-semibold currency ${textColor}`}>
          {formatCurrency(amount)} of {formatCurrency(limit)} spent
        </div>
      </div>
    </div>
  );
}