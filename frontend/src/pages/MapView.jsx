import RiskMap from '../components/RiskMap';

/**
 * Map View Page
 * Interactive map-based visualization with risk levels
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

      {/* Risk Map */}
      <RiskMap />
    </div>
  );
}

export default MapView;
