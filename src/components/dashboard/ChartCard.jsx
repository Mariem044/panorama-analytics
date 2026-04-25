export function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`
        group relative bg-gradient-to-br from-card via-card/98 to-card/95 border border-border/60 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6
        hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25
        transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1
        overflow-hidden backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        ${className}
      `.trim()}
    >
      {/* Header */}
      <div className="mb-4 md:mb-5 relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] md:text-[16px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-muted-foreground mt-1.5 group-hover:text-foreground/80 transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}