/**
 * StatCard Component
 * Reusable KPI card for displaying key metrics
 */
function StatCard({ title, value, subtitle, color = 'primary', icon }) {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200',
    success: 'bg-gradient-to-br from-success-50 to-success-100 border-success-200',
    risk: 'bg-gradient-to-br from-risk-50 to-risk-100 border-risk-200',
    warning: 'bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200',
    analytics: 'bg-gradient-to-br from-analytics-50 to-analytics-100 border-analytics-200'
  };

  const valueColors = {
    primary: 'text-primary-700',
    success: 'text-success-700',
    risk: 'text-risk-700',
    warning: 'text-warning-700',
    analytics: 'text-analytics-700'
  };

  const iconBgColors = {
    primary: 'bg-primary-200',
    success: 'bg-success-200',
    risk: 'bg-risk-200',
    warning: 'bg-warning-200',
    analytics: 'bg-analytics-200'
  };

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg border ${colorClasses[color]} p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold ${valueColors[color]} mb-2`}>
            {value !== null && value !== undefined ? value : '—'}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-600 font-medium">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBgColors[color]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
      
      {/* Decorative corner element */}
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${iconBgColors[color]} opacity-20`}></div>
    </div>
  );
}

export default StatCard;
