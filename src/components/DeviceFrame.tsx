interface DeviceFrameProps {
  children: React.ReactNode;
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="device-frame w-[390px] h-[844px] rounded-[24px] overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}