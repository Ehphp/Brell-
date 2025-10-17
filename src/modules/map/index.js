/**
 * Map Module
 * Gestisce la mappa interattiva con Mapbox
 */

import { trackEvent } from '../../utils/analytics.js';
import { toast } from '../ui/toast.js';

export class MapManager {
    constructor() {
        this.mapEl = document.getElementById('map');
        this.cityInput = document.getElementById('city-search');
        this.searchForm = document.getElementById('map-search-form');
        this.locateBtn = document.getElementById('map-locate-me');
        this.map = null;
        this.geolocateControl = null;
        this.isSearching = false;
        this.accessToken = 'pk.eyJ1IjoiaHBocGhwaHAiLCJhIjoiY21lazB5MHhmMDB4eDJscXJ0NmlxMnFrMCJ9.Uqgp2euLBUrE1OrRCHq0EQ';

        this.brands = [
            { coordinates: [12.4964, 41.9028], name: 'Brand A' },
            { coordinates: [9.19, 45.4642], name: 'Brand B' }
        ];
    }

    setupClickTracking() {
        if (!this.mapEl) return;

        this.mapEl.addEventListener('click', () => {
            trackEvent('map_interaction', {
                category: 'engagement',
                label: 'map_clicked'
            });
        });
    }

    setupViewTracking() {
        if (!this.mapEl) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('view_map', {
                        category: 'engagement',
                        label: 'map_section_viewed'
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(this.mapEl);
    }

    addMarkers() {
        this.brands.forEach(b => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.textContent = b.name.charAt(0);

            new mapboxgl.Marker(el)
                .setLngLat(b.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(b.name))
                .addTo(this.map);
        });
    }

    addRoute() {
        if (!this.map || this.brands.length <= 1) return;

        const styleLoaded = typeof this.map.isStyleLoaded === 'function'
            ? this.map.isStyleLoaded()
            : true;

        if (!styleLoaded && typeof this.map.once === 'function') {
            this.map.once('load', () => this.addRoute());
            return;
        }

        const sourceId = 'route';
        const layerId = 'route';
        const routeGeoJSON = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: this.brands.map(b => b.coordinates)
            }
        };

        if (!this.map.getSource(sourceId)) {
            this.map.addSource(sourceId, {
                type: 'geojson',
                data: routeGeoJSON
            });
        } else {
            this.map.getSource(sourceId).setData(routeGeoJSON);
        }

        if (!this.map.getLayer(layerId)) {
            this.map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#F3B300',
                    'line-width': 4
                }
            });
        }
    }

    setupCitySearch() {
        if (!this.cityInput) return;

        const submitButton = this.searchForm?.querySelector('.howto__search-btn') || null;

        const flyToCity = (lng, lat) => {
            if (!this.map) return;

            const go = () => this.map.flyTo({ center: [lng, lat], zoom: 13 });

            const styleLoaded = typeof this.map.isStyleLoaded === 'function'
                ? this.map.isStyleLoaded()
                : true;

            if (!styleLoaded && typeof this.map.once === 'function') {
                // Wait for the map style to be ready before flying to the new location
                this.map.once('load', go);
                return;
            }

            go();
        };

        const handleSearch = (event) => {
            event?.preventDefault?.();

            const query = this.cityInput.value.trim();
            if (!query) {
                toast('Inserisci il nome di una citta');
                return;
            }

            if (!this.map) {
                toast('La mappa non e ancora pronta');
                return;
            }

            if (this.isSearching) return;
            this.isSearching = true;
            submitButton?.classList.add('is-busy');
            if (submitButton) submitButton.disabled = true;

            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query + ', Italia')}.json?access_token=${this.accessToken}&limit=1`;

            fetch(url)
                .then(r => r.json())
                .then(res => {
                    if (res.features && res.features.length) {
                        const [lng, lat] = res.features[0].center;
                        flyToCity(lng, lat);
                    } else {
                        toast('Citta non trovata');
                    }
                })
                .catch(err => {
                    console.error('Geocoding error:', err);
                    toast('Errore durante la ricerca della citta');
                })
                .finally(() => {
                    this.isSearching = false;
                    submitButton?.classList.remove('is-busy');
                    if (submitButton) submitButton.disabled = false;
                });
        };

        if (this.searchForm) {
            this.searchForm.addEventListener('submit', handleSearch);
        } else {
            this.cityInput.addEventListener('change', handleSearch);
        }
    }

    setupLocateButton() {
        if (!this.locateBtn) return;

        this.locateBtn.addEventListener('click', () => {
            if (!this.map || !this.geolocateControl) {
                toast('La mappa non e ancora pronta');
                return;
            }

            try {
                const triggered = this.geolocateControl.trigger();
                if (triggered === false) {
                    toast('Abilita la geolocalizzazione per centrare la mappa');
                }
            } catch (err) {
                console.error('Geolocate error:', err);
                toast('Impossibile ottenere la tua posizione');
            }
        });
    }

    init() {
        if (!this.mapEl || !window.mapboxgl) return;

        mapboxgl.accessToken = this.accessToken;

        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/hphphphp/cmek34twr001o01qt8yff8wlz'
        });

        // this.map.addControl(new mapboxgl.NavigationControl());
        // this.geolocateControl = new mapboxgl.GeolocateControl({
        //     positionOptions: { enableHighAccuracy: true },
        //     trackUserLocation: true,
        //     showUserHeading: true
        // });
        // this.map.addControl(this.geolocateControl);

        this.addMarkers();
        this.setupCitySearch();
        this.setupLocateButton();
        this.setupClickTracking();
        this.setupViewTracking();

        this.map.on('load', () => {
            this.addRoute();
            this.map.resize();
        });

        requestAnimationFrame(() => this.map?.resize());
        setTimeout(() => this.map?.resize(), 400);
    }
}

export function initMap() {
    const mapManager = new MapManager();
    mapManager.init();
}
