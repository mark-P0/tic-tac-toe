
export function LoadingPing() {
  return (
    <div className="grid *:row-[1] *:col-[1] h-12 aspect-square">
      <div className="rounded-full bg-stone-500"></div>
      <div className="rounded-full bg-stone-500 animate-ping"></div>
    </div>
  );
}