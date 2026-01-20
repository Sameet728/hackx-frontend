import RiskMap from '../components/RiskMap';

/**
 * Map View Page
 * Interactive map-based visualization with risk levels
 */
function MapView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-success-50/30">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <span className="text-4xl">🗺️</span>
            Geographic Risk Map
          </h1>
          <p className="text-gray-600 flex items-center gap-2 ml-12">
            <span className="inline-flex items-center justify-center w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            Interactive map showing health incidents, sanitation issues, and environmental data
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-gradient-to-r from-primary-50 to-success-50 border-l-4 border-primary-500 rounded-r-xl p-4 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-gray-700">
                <strong className="font-semibold text-primary-800">Pro Tip:</strong> Click on markers to view detailed information. Use the layer controls to toggle different data types.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Map */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <RiskMap />
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">📍</span>
            Map Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Risk Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-risk-500"></div>
                  <span className="text-sm text-gray-600">High Risk - Immediate attention required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning-500"></div>
                  <span className="text-sm text-gray-600">Medium Risk - Monitor closely</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-success-500"></div>
                  <span className="text-sm text-gray-600">Low Risk - Normal conditions</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Incident Types</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏥</span>
                  <span className="text-sm text-gray-600">Health Incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚮</span>
                  <span className="text-sm text-gray-600">Sanitation Complaints</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌫️</span>
                  <span className="text-sm text-gray-600">Air Quality Data</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Real-time data synchronization</p>
                <p>• Area-wise risk aggregation</p>
                <p>• Interactive marker clustering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;
