import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Map } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/** Zone data with coordinates for the Google Maps overlay */
const ZONE_DATA = [
  { name: 'Gate A', density: 85, avgWait: 5.2, lat: 51.5553, lng: -0.1080, color: '#ff3366' },
  { name: 'Gate B', density: 40, avgWait: 1.5, lat: 51.5565, lng: -0.1095, color: '#00ffcc' },
  { name: 'Gate C', density: 55, avgWait: 2.8, lat: 51.5570, lng: -0.1060, color: '#ffaa00' },
  { name: 'North Conc', density: 72, avgWait: 4.1, lat: 51.5560, lng: -0.1045, color: '#9d00ff' },
  { name: 'VIP', density: 20, avgWait: 0.5, lat: 51.5545, lng: -0.1070, color: '#00e676' },
];

/** Dark map style to match the dashboard aesthetic */
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0a0b10' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0b10' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9ba1b0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2130' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#051525' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
];

/**
 * ZoneInsightsPanel - Displays zone density bar chart and a Google Maps overlay
 * showing real-time crowd density per gate as interactive circles.
 */
function ZoneInsightsPanel() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return; // Only load once

    const loader = new Loader({
      apiKey: MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then((google) => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 51.5558, lng: -0.1070 },
        zoom: 16,
        styles: DARK_MAP_STYLES,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;

      // Add density circles for each zone
      ZONE_DATA.forEach((zone) => {
        const circle = new google.maps.Circle({
          strokeColor: zone.color,
          strokeOpacity: 0.9,
          strokeWeight: 2,
          fillColor: zone.color,
          fillOpacity: 0.3,
          map,
          center: { lat: zone.lat, lng: zone.lng },
          radius: zone.density * 1.2, // scale by density
        });

        const label = new google.maps.InfoWindow({
          content: `
            <div style="background:#1e2130;color:#f0f2f5;padding:10px 14px;border-radius:8px;
              font-family:'Outfit',sans-serif;border-left:3px solid ${zone.color};min-width:140px">
              <strong style="font-size:1rem">${zone.name}</strong><br/>
              <span style="color:#9ba1b0;font-size:0.85rem">Density:</span>
              <span style="color:${zone.color};font-weight:600"> ${zone.density}%</span><br/>
              <span style="color:#9ba1b0;font-size:0.85rem">Avg Wait:</span>
              <span style="font-weight:600"> ${zone.avgWait} min</span>
            </div>`,
        });

        circle.addListener('click', () => {
          label.setPosition({ lat: zone.lat, lng: zone.lng });
          label.open(map);
        });
      });
    }).catch((err) => {
      console.error('[Synchra] Google Maps failed to load:', err);
    });
  }, []);

  return (
    <>
      <section className="glass-card" aria-label="Zone Density Analysis">
        <div className="card-header">
          <div className="card-title">
            <Map size={20} color="var(--accent-purple)" aria-hidden="true" />
            Zone Density Analysis
          </div>
        </div>
        <div
          className="chart-container-wrapper"
          style={{ minHeight: '200px' }}
          role="img"
          aria-label="Bar chart comparing crowd density percentages across venue zones"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ZONE_DATA} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-panel)',
                  borderColor: 'var(--border-light)',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="density" name="Density (%)" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-card" style={{ flex: 1 }} aria-label="Live Google Maps venue crowd density overlay">
        <div className="card-header">
          <div className="card-title">
            <Map size={20} color="var(--accent-cyan)" aria-hidden="true" />
            Live Venue Map · Crowd Density
          </div>
        </div>
        <div
          ref={mapRef}
          id="venue-google-map"
          style={{ flex: 1, minHeight: '320px', borderRadius: '12px', overflow: 'hidden' }}
          role="application"
          aria-label="Interactive Google Map showing crowd density per venue zone. Click a circle to see details."
          tabIndex={0}
        />
      </section>
    </>
  );
}

export default ZoneInsightsPanel;
