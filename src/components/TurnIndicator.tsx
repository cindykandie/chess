type TurnIndicatorProps = {
  statusText: string;
};

export default function TurnIndicator({ statusText }: TurnIndicatorProps) {
  return <p className="text-slate-300 mb-4 min-h-[1.5rem]">{statusText}</p>;
}
