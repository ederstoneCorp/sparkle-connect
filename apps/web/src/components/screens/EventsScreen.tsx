import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { Calendar, MapPin, Users, Check, Plus, Search, Sparkles } from 'lucide-react';

export const EventsScreen: React.FC = () => {
  const { events, toggleRsvpEvent, selectedUniversityId, universities } = useSparkle();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((e) => {
    if (selectedUniversityId !== 'ALL') {
      const selectedUniv = universities.find((u) => u.id === selectedUniversityId);
      if (selectedUniv && !e.university.toLowerCase().includes(selectedUniv.shortName.toLowerCase())) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchDesc = e.description.toLowerCase().includes(q);
      const loc = e.location || e.venue || '';
      const matchVenue = loc.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchVenue) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Campus Events & Hackathons</h2>
          <p className="text-xs text-slate-500">Upcoming tech summits, student competitions, and career fairs in Kenya</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, venues, dates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {event.imageUrl && (
              <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                  {event.university}
                </div>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 mb-2 leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-sparkle-purple" />
                    <span>{event.date || event.dateString} • {event.time || event.timeString}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-sparkle-orange" />
                    <span>{event.location || event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-slate-500">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{(event.attendeesCount ?? event.attendeeCount ?? 0).toLocaleString()} Comrades Attending</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                  Free Student Entry
                </span>

                <button
                  onClick={() => toggleRsvpEvent(event.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    (event.isRsvpd || event.isRegistered)
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-sparkle-purple text-white hover:bg-sparkle-purple-dark shadow-xs'
                  }`}
                >
                  {(event.isRsvpd || event.isRegistered) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>RSVP Attend</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
