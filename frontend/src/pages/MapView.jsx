/**
 * Map View Page
 * Placeholder for map-based visualization
 * Will integrate Leaflet in Phase 2
 */
function MapView() {
  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Geographic Risk Map
        </h1>
        <p className="text-gray-600">
          Interactive map showing health incidents, sanitation issues, and environmental data
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="card">
        <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: '500px' }}>
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Map Integration Coming Soon
            </h3>
            <p className="text-gray-600 mb-4">
              Leaflet map will be integrated in Phase 2
            </p>
            <div className="inline-block bg-white px-4 py-2 rounded-md shadow-sm">
              <p className="text-sm text-gray-600">
                Features: Heat maps, markers, clustering, filters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">🏥 Health Layer</h3>
          <label className="flex items-center text-gray-600 cursor-not-allowed">
            <input
              type="checkbox"
              disabled
              className="mr-2"
            />
            Show health incidents
          </label>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">🚰 Sanitation Layer</h3>
          <label className="flex items-center text-gray-600 cursor-not-allowed">
            <input
              type="checkbox"
              disabled
              className="mr-2"
            />
            Show complaints
          </label>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">🌍 Environmental Layer</h3>
          <label className="flex items-center text-gray-600 cursor-not-allowed">
            <input
              type="checkbox"
              disabled
              className="mr-2"
            />
            Show air/water quality
          </label>
        </div>
      </div>
    </div>
  );
}

export default MapView;
