export function PresentationCard({ presentation }: { presentation: any }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-beige">
      <h4 className="text-lg font-semibold text-darkBrown">{presentation.title}</h4>
      <p className="text-sm text-graphite mt-2">{presentation.description}</p>
    </div>
  );
}