interface DeviceFrameProps {
  children: React.ReactNode;
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="device-frame w-[390px] h-[844px] rounded-[24px] overflow-hidden relative bg-background">
        {children}
        {/* Home Indicator (bottom pill) */}
        <div className="pointer-events-none absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[120px] h-[5px] rounded-full bg-foreground/40 dark:bg-foreground/50 backdrop-blur-sm" />
      </div>
    </div>
  );
}