import React, { useEffect, useRef, useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { University } from '../../types/models';
import { X, MapPin, Users, Globe, ExternalLink, Search, CheckCircle2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUniversity: (id: string) => void;
}

// Fix Leaflet default marker icon paths broken by Vite bundling
function fixLeafletIcons(L: typeof import('leaflet')) {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const TYPE_COLORS: Record<string, string> = {
  national:  '#3B82F6', // blue
  technical: '#F59E0B', // amber
  private:   '#8B5CF6', // purple
};

export const CampusMapModal: React.FC<CampusMapModalProps> = ({
  isOpen,
  onClose,
  onSelectUniversity,
}) => {
  const { universities: baseUniversities, selectedUniversityId } = useSparkle();
  const [customUniversities, setCustomUniversities] = useState<University[]>([]);
  const universities = useMemo(() => [...baseUniversities, ...customUniversities], [baseUniversities, customUniversities]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').CircleMarker[]>([]);
  const [activeUniversity, setActiveUniversity] = useState<University | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Manual entry & geocoding state
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualShortName, setManualShortName] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [manualType, setManualType] = useState<'national' | 'technical' | 'private'>('national');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingStatus, setGeocodingStatus] = useState<string | null>(null);

  // Geocoding helper function using OpenStreetMap Nominatim API with robust fallback
  const geocodeUniversityLocation = async (locationQuery: string): Promise<{ lat: number; lng: number }> => {
    try {
      setGeocodingStatus('Querying OpenStreetMap Nominatim geocoder...');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery + ', Kenya')}&limit=1`,
        { headers: { 'User-Agent': 'SparkleConnect/1.0' } }
      );
      const data = await res.json();
      if (data && data.length > 0 && data[0].lat && data[0].lon) {
        setGeocodingStatus('Precise coordinates acquired & stored!');
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (err) {
      console.warn('Geocoding API network error, using regional estimation:', err);
    }
    setGeocodingStatus('Using estimated regional Kenya coordinates.');
    return { lat: -1.28 + (Math.random() - 0.5) * 0.4, lng: 36.82 + (Math.random() - 0.5) * 0.4 };
  };

  const handleAddManualUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualLocation.trim()) return;

    setIsGeocoding(true);
    setGeocodingStatus('Geocoding campus location...');

    const { lat, lng } = await geocodeUniversityLocation(manualLocation || manualName);

    const newUni: University = {
      id: `manual_${Date.now()}`,
      name: manualName.trim(),
      shortName: manualShortName.trim() || manualName.trim().slice(0, 6),
      location: manualLocation.trim(),
      type: manualType,
      lat,
      lng,
      founded: new Date().getFullYear(),
      students: 1500,
      website: '',
    };

    setCustomUniversities((prev) => [...prev, newUni]);

    // Add marker to map and fly to precise coordinates
    if (mapRef.current) {
      const L = await import('leaflet');
      const color = TYPE_COLORS[newUni.type ?? 'national'] ?? '#6C3BFF';
      const marker = L.circleMarker([lat, lng], {
        radius: 14,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      })
        .addTo(mapRef.current)
        .bindTooltip(`<strong>${newUni.shortName}</strong><br>${newUni.location}`, {
          permanent: false,
          direction: 'top',
          className: 'sparkle-map-tooltip',
        })
        .on('click', () => {
          setActiveUniversity(newUni);
        });

      markersRef.current.push(marker);
      mapRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
    }

    setActiveUniversity(newUni);
    setIsGeocoding(false);
    setShowManualForm(false);
    setManualName('');
    setManualShortName('');
    setManualLocation('');
    setGeocodingStatus(null);
  };

  // ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lazy-load Leaflet only in browser
  useEffect(() => {
    if (!isOpen) return;

    let destroyed = false;

    const initMap = async () => {
      if (!mapContainerRef.current) return;
      if (mapRef.current) return; // already initialized

      const L = await import('leaflet');
      fixLeafletIcons(L);

      if (destroyed || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [-0.5, 37.5], // center of Kenya
        zoom: 6,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // OpenStreetMap tile layer (free, no API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      // Add circle markers for each university
      const withCoords = universities.filter((u) => u.lat != null && u.lng != null);

      withCoords.forEach((u) => {
        const color = TYPE_COLORS[u.type ?? 'national'] ?? '#6C3BFF';
        const isSelected = selectedUniversityId === u.id;

        const marker = L.circleMarker([u.lat!, u.lng!], {
          radius: isSelected ? 14 : 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: isSelected ? 1 : 0.8,
        })
          .addTo(map)
          .bindTooltip(`<strong>${u.shortName}</strong><br>${u.location}`, {
            permanent: false,
            direction: 'top',
            className: 'sparkle-map-tooltip',
          })
          .on('click', () => {
            setActiveUniversity(u);
          });

        markersRef.current.push(marker);
      });

      setIsMapLoaded(true);
    };

    initMap();

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
        setIsMapLoaded(false);
        setActiveUniversity(null);
      }
    };
  }, [isOpen, universities]);

  // Pan map to searched university
  const handleMapSearch = async (u: University) => {
    setActiveUniversity(u);
    if (mapRef.current && u.lat != null && u.lng != null) {
      mapRef.current.flyTo([u.lat, u.lng], 13, { duration: 1.2 });
    }
  };

  const filteredUniversities = searchQuery.trim()
    ? universities.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.shortName.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectAndClose = (id: string) => {
    onSelectUniversity(id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-sparkle-darkSurface rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col h-[90vh] animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sparkle-blue to-sparkle-mint flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Kenyan University Campus Map
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Interactive map — click a marker to explore a campus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Map + Sidebar */}
        <div className="flex flex-1 min-h-0">

          {/* Left sidebar */}
          <div className="w-72 shrink-0 flex flex-col border-r border-slate-100 dark:border-slate-700 overflow-hidden">
            {/* Map search */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-700">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search & pan to campus..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sparkle-blue/30 font-medium dark:text-slate-200"
                />
              </div>

              {/* Search suggestions dropdown */}
              {filteredUniversities.length > 0 && (
                <div className="mt-1 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-sparkle-darkSurface shadow-md overflow-hidden max-h-48 overflow-y-auto">
                  {filteredUniversities.slice(0, 6).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => { handleMapSearch(u); setSearchQuery(''); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sparkle-blue shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{u.shortName}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{u.location}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Legend</p>
              <div className="flex flex-col gap-1">
                {[
                  { key: 'national', label: 'Public / National', color: '#3B82F6' },
                  { key: 'technical', label: 'Technical', color: '#F59E0B' },
                  { key: 'private', label: 'Private / Chartered', color: '#8B5CF6' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full shrink-0 border-2 border-white shadow-sm" style={{ background: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Manual entry toggle */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="w-full py-1.5 px-3 rounded-xl bg-sparkle-purple/10 hover:bg-sparkle-purple/20 text-sparkle-purple text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                {showManualForm ? 'Close Manual Entry' : "Can't find university? Add Manually"}
              </button>
            </div>

            {/* Manual Entry Form */}
            {showManualForm && (
              <form onSubmit={handleAddManualUniversity} className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Add & Geocode Campus</p>
                <input
                  type="text"
                  placeholder="University Name (e.g. Kitale Tech)"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium dark:text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Short Name / Acronym (e.g. KTC)"
                  value={manualShortName}
                  onChange={(e) => setManualShortName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium dark:text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Location / County (e.g. Kitale, Trans Nzoia)"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium dark:text-slate-200"
                />
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium dark:text-slate-200"
                >
                  <option value="national">Public / National</option>
                  <option value="technical">Technical</option>
                  <option value="private">Private / Chartered</option>
                </select>
                {geocodingStatus && (
                  <p className="text-[10px] text-sparkle-purple font-semibold animate-pulse">{geocodingStatus}</p>
                )}
                <button
                  type="submit"
                  disabled={isGeocoding}
                  className="w-full py-2 rounded-lg bg-sparkle-purple text-white text-xs font-bold hover:bg-sparkle-purple-dark transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isGeocoding ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Geocoding...
                    </>
                  ) : (
                    'Geocode & Place Marker'
                  )}
                </button>
              </form>
            )}

            {/* Active university detail */}
            {activeUniversity ? (
              <div className="flex-1 overflow-y-auto p-3">
                <div className="bg-gradient-to-br from-sparkle-purple/5 to-sparkle-blue/5 dark:from-sparkle-purple/10 dark:to-sparkle-blue/10 rounded-2xl p-4 border border-sparkle-purple/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
                      style={{ background: TYPE_COLORS[activeUniversity.type ?? 'national'] }}
                    >
                      {activeUniversity.shortName.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                        {activeUniversity.name}
                      </p>
                      <p className="text-[10px] text-sparkle-purple font-semibold">
                        {activeUniversity.shortName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{activeUniversity.location}</span>
                    </div>
                    {activeUniversity.students && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{activeUniversity.students.toLocaleString()} students</span>
                      </div>
                    )}
                    {activeUniversity.founded && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Est. {activeUniversity.founded}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleSelectAndClose(activeUniversity.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sparkle-purple text-white text-xs font-extrabold hover:bg-sparkle-purple-dark transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Select {activeUniversity.shortName}
                    </button>
                    {activeUniversity.website && (
                      <a
                        href={activeUniversity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>

                {/* All universities quick list */}
                <div className="mt-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                    All Campuses
                  </p>
                  <div className="space-y-0.5">
                    {universities.filter((u) => u.lat).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleMapSearch(u)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-[11px] transition-colors ${
                          activeUniversity?.id === u.id
                            ? 'bg-sparkle-purple/10 text-sparkle-purple font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: TYPE_COLORS[u.type ?? 'national'] }}
                        />
                        <span className="font-semibold truncate">{u.shortName}</span>
                        <span className="text-slate-400 truncate text-[10px] ml-auto">{u.location.split(',')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <MapPin className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs font-semibold">Click any marker on the map</p>
                <p className="text-[11px] mt-1">or search above to pan to a campus</p>
              </div>
            )}
          </div>

          {/* Map container */}
          <div className="flex-1 relative">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 z-10">
                <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                  <div className="w-8 h-8 border-3 border-sparkle-blue border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Loading Kenya map...</p>
                </div>
              </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* OSM attribution style override (already in tile) */}
            <style>{`
              .sparkle-map-tooltip {
                background: #1C1A2A;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                padding: 6px 10px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
              }
              .sparkle-map-tooltip::before {
                display: none;
              }
              .leaflet-tooltip.sparkle-map-tooltip {
                background: #1C1A2A;
                border: 1px solid rgba(108,59,255,0.4);
              }
            `}</style>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>🗺️ Map data © OpenStreetMap contributors</span>
            <span>•</span>
            <span>{universities.filter((u) => u.lat).length} campuses mapped</span>
          </div>
          <button
            onClick={() => handleSelectAndClose('ALL')}
            className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
          >
            Show All Campuses
          </button>
        </div>
      </div>
    </div>
  );
};
