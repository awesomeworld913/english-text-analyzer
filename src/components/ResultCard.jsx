export default function ResultCard({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}
