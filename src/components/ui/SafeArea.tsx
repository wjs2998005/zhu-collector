interface SafeAreaProps {
  top?: boolean;
  bottom?: boolean;
}

export function SafeArea({ top, bottom }: SafeAreaProps) {
  if (top) {
    return <div className="pt-safe" />;
  }
  if (bottom) {
    return <div className="pb-safe" />;
  }
  return null;
}