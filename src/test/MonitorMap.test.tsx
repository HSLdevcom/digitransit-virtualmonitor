import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { ConfigContext } from '../contexts';

// Mock factories only use vi.fn() with no external variable references to
// avoid babel-jest hoisting issues. Return values are set in beforeEach.
vi.mock('leaflet/dist/leaflet.css', () => ({}));
vi.mock('react-dom/server', () => ({
  default: { renderToString: () => '<svg></svg>' },
}));
vi.mock('../ui/Icon', () => ({ __esModule: true, default: () => null }));
vi.mock('../Vehicleicon', () => ({ __esModule: true, default: () => null }));
vi.mock('../api', () => ({
  __esModule: true,
  default: { getMapSettings: vi.fn() },
}));
vi.mock('../util/mqttUtils', () => ({ changeTopics: vi.fn() }));
vi.mock('leaflet', () => {
  const map = vi.fn();
  const divIcon = vi.fn();
  const marker = vi.fn();
  const tileLayer = vi.fn();
  const LatLng = vi.fn();
  return {
    default: { map, divIcon, marker, tileLayer, LatLng },
    // named exports so `import { LatLng } from 'leaflet'` resolves to the same instance
    map,
    divIcon,
    marker,
    tileLayer,
    LatLng,
  };
});

import L from 'leaflet';
import MonitorMap from '../ui/monitorMap';
import monitorAPI from '../api';
import { changeTopics } from '../util/mqttUtils';
import type {
  IMessage,
  IMapSettings,
  BoundingBox,
  Coordinate,
} from '../util/Interfaces';
import type { IDeparture } from '../ui/MonitorRow';

// ---------------------------------------------------------------------------
// Shared mock objects – defined after imports, fully initialised before tests.
// ---------------------------------------------------------------------------
const mockMapInstance = {
  setView: vi.fn(),
  fitBounds: vi.fn(),
  invalidateSize: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  remove: vi.fn(),
  eachLayer: vi.fn(),
  removeLayer: vi.fn(),
};

const mockMarkerInstance = {
  addTo: vi.fn(),
  setLatLng: vi.fn(),
  setIcon: vi.fn(),
  remove: vi.fn(),
};

const mockTileLayerInstance = { addTo: vi.fn() };

const TILE_URL = 'https://tile.example.com/{z}/{x}/{y}.png';

const mockConfig = {
  rtVehicleOffsetSeconds: 120,
  modeIcons: {
    colors: {
      'mode-bus': '#007ac9',
      'mode-rail': '#8c4799',
    },
  },
};

const defaultMapSettings: IMapSettings = {
  bounds: [
    [60.2, 24.9],
    [60.1, 24.8],
  ] as BoundingBox,
  center: [60.15, 24.85] as Coordinate,
  zoom: 14,
  stops: [
    {
      coords: [60.15, 24.85] as Coordinate,
      gtfsId: 'HSL:1230101',
      mode: 'BUS',
      name: 'Test Stop 1',
    },
  ] as IMapSettings['stops'],
};

const defaultProps = {
  mapSettings: defaultMapSettings,
  messages: [] as IMessage[],
  departuresForMap: [] as IDeparture[],
  clientRef: { current: null } as { current: unknown },
  topicRef: { current: null } as { current: unknown },
  newTopics: undefined as string[] | undefined,
  lang: 'fi',
  vehicleMarkerState: new Map(),
  setVehicleMarkerState: vi.fn(),
  preview: false,
  modal: false,
};

const renderWithContext = (props: Partial<typeof defaultProps> = {}) => {
  const merged = { ...defaultProps, ...props };
  return render(
    <ConfigContext.Provider value={mockConfig}>
      <MonitorMap {...merged} />
    </ConfigContext.Provider>,
  );
};

const buildMessage = (overrides: Record<string, unknown> = {}) => ({
  id: 'veh-1',
  route: 'TAMPERE:123',
  lat: 60.18,
  long: 24.93,
  next_stop: 'HSL:1230101',
  direction: 0,
  tripStartTime: '08:00',
  headsign: 'Center',
  heading: 90,
  shortName: '3',
  color: '#FF0000',
  ...overrides,
});

// ---------------------------------------------------------------------------
// Setup – re-apply all mock implementations before every test so that
// vi.clearAllMocks() never leaves them in an undefined state.
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks();

  (global as any).ResizeObserver = vi.fn(function (this: any) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });

  (L.map as vi.Mock).mockReturnValue(mockMapInstance);
  (L.marker as vi.Mock).mockReturnValue(mockMarkerInstance);
  (L.tileLayer as unknown as vi.Mock).mockReturnValue(mockTileLayerInstance);
  (L.divIcon as vi.Mock).mockImplementation(opts => opts);
  (L.LatLng as vi.Mock).mockImplementation(function (
    this: any,
    lat: number,
    lng: number,
  ) {
    return [lat, lng];
  });

  // setView chains: L.map(...).setView(...) must return the map instance.
  mockMapInstance.setView.mockReturnValue(mockMapInstance);
  mockMarkerInstance.addTo.mockReturnValue(mockMarkerInstance);

  (monitorAPI.getMapSettings as vi.Mock).mockResolvedValue(TILE_URL);
  defaultProps.setVehicleMarkerState = vi.fn();
  defaultProps.vehicleMarkerState = new Map();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('Rendering', () => {
  it('renders a div with id="map"', () => {
    const { container } = renderWithContext();
    expect(container.querySelector('#map')).toBeTruthy();
  });

  it('applies the monitormap CSS class', () => {
    const { container } = renderWithContext();
    expect(container.querySelector('.monitormap')).toBeTruthy();
  });

  it('adds the preview class when the preview prop is true', () => {
    const { container } = renderWithContext({ preview: true });
    expect(container.querySelector('.monitormap.preview')).toBeTruthy();
  });

  it('adds the modal class when the modal prop is true', () => {
    const { container } = renderWithContext({ modal: true });
    expect(container.querySelector('.monitormap.modal')).toBeTruthy();
  });

  it('does not include preview or modal classes by default', () => {
    const { container } = renderWithContext();
    const el = container.querySelector('.monitormap');
    expect(el?.classList.contains('preview')).toBe(false);
    expect(el?.classList.contains('modal')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Map initialisation
// ---------------------------------------------------------------------------
describe('Map initialisation', () => {
  it('creates a Leaflet map with zoom controls and animation disabled', () => {
    renderWithContext();
    expect(L.map).toHaveBeenCalledWith('map', {
      zoomControl: false,
      zoomAnimation: false,
    });
  });

  it('sets the initial view to the configured centre and zoom level', () => {
    renderWithContext();
    expect(mockMapInstance.setView).toHaveBeenCalledWith(
      defaultMapSettings.center,
      defaultMapSettings.zoom,
    );
  });

  it('fetches the tile-layer URL using the correct language', async () => {
    renderWithContext({ lang: 'sv' });
    await waitFor(() =>
      expect(monitorAPI.getMapSettings).toHaveBeenCalledWith('sv'),
    );
  });

  it('adds the tile layer to the map after the API resolves', async () => {
    renderWithContext();
    await waitFor(() => {
      expect(L.tileLayer).toHaveBeenCalledWith(TILE_URL, expect.any(Object));
      expect(mockTileLayerInstance.addTo).toHaveBeenCalledWith(mockMapInstance);
    });
  });

  it('fits the map to the bounds supplied in mapSettings', async () => {
    renderWithContext();
    await waitFor(() => {
      expect(mockMapInstance.fitBounds).toHaveBeenCalledWith(
        defaultMapSettings.bounds,
      );
    });
  });

  it('creates a stop-icon marker for every stop in mapSettings', async () => {
    renderWithContext();
    await waitFor(() => {
      expect(L.divIcon).toHaveBeenCalled();
      expect(L.marker).toHaveBeenCalledWith(
        defaultMapSettings.stops[0].coords,
        expect.objectContaining({ icon: expect.any(Object) }),
      );
    });
  });
});

// ---------------------------------------------------------------------------
// Cleanup / memory-leak prevention
// ---------------------------------------------------------------------------
describe('Cleanup on unmount', () => {
  it('calls map.off() and map.remove() to release Leaflet resources', async () => {
    const { unmount } = renderWithContext();
    await waitFor(() => expect(mockTileLayerInstance.addTo).toHaveBeenCalled());
    act(() => {
      unmount();
    });
    expect(mockMapInstance.off).toHaveBeenCalled();
    expect(mockMapInstance.remove).toHaveBeenCalled();
  });

  it('removes all vehicle markers from the map before unmounting', async () => {
    const { unmount } = renderWithContext({
      messages: [buildMessage()] as unknown as IMessage[],
    });
    await waitFor(() => expect(mockTileLayerInstance.addTo).toHaveBeenCalled());
    act(() => {
      unmount();
    });
    expect(mockMarkerInstance.remove).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Vehicle marker lifecycle
// ---------------------------------------------------------------------------
describe('Vehicle markers', () => {
  it('creates a Leaflet marker at the vehicle coordinates for a new message', () => {
    const msg = buildMessage();
    renderWithContext({ messages: [msg] as unknown as IMessage[] });
    expect(L.marker).toHaveBeenCalledWith(
      [msg.lat, msg.long],
      expect.objectContaining({ icon: expect.any(Object) }),
    );
  });

  it('updates the existing marker position when the same vehicle sends a new message', () => {
    const msg = buildMessage();
    const { rerender } = renderWithContext({
      messages: [msg] as unknown as IMessage[],
      departuresForMap: [],
    });

    const updatedMsg = { ...msg, lat: 60.19, long: 24.94 };
    act(() => {
      rerender(
        <ConfigContext.Provider value={mockConfig}>
          <MonitorMap
            {...defaultProps}
            messages={[updatedMsg] as unknown as IMessage[]}
            departuresForMap={[]}
          />
        </ConfigContext.Provider>,
      );
    });

    expect(mockMarkerInstance.setLatLng).toHaveBeenCalled();
  });

  it('does not call L.marker a second time for the same vehicle id', async () => {
    const msg = buildMessage();
    const { rerender } = renderWithContext({
      messages: [msg] as unknown as IMessage[],
      departuresForMap: [],
    });
    await waitFor(() => expect(mockTileLayerInstance.addTo).toHaveBeenCalled());

    const markerCallCount = (L.marker as vi.Mock).mock.calls.length;

    act(() => {
      rerender(
        <ConfigContext.Provider value={mockConfig}>
          <MonitorMap
            {...defaultProps}
            messages={[msg] as unknown as IMessage[]}
            departuresForMap={[]}
          />
        </ConfigContext.Provider>,
      );
    });

    expect((L.marker as vi.Mock).mock.calls.length).toBe(markerCallCount);
  });

  it('does not create a marker for an HSL vehicle with invalid coordinates', () => {
    // For HSL routes, shouldShowVehicle() guards on lat/long before creating
    // a marker. A NaN position must not produce a Leaflet marker.
    const hslDeparture = {
      trip: {
        route: { gtfsId: 'HSL:123', alerts: [], shortName: '123' },
        gtfsId: 'HSL:123_trip',
        directionId: '0',
      },
      headsign: 'Helsinki',
    };
    const msg = buildMessage({
      route: 'HSL:123',
      lat: NaN,
      long: NaN,
      headsign: 'Helsinki',
      direction: 0,
    });

    renderWithContext({
      messages: [msg] as unknown as IMessage[],
      departuresForMap: [hslDeparture] as unknown as IDeparture[],
    });

    const markerCallsWithNaNCoords = (L.marker as vi.Mock).mock.calls.filter(
      ([coords]) => isNaN(coords[0]),
    );
    expect(markerCallsWithNaNCoords).toHaveLength(0);
  });

  it('should not crash and should place a marker when an HSL vehicle has no matching departure', () => {
    const msg = buildMessage({ route: 'HSL:456', lat: 60.18, long: 24.93 });

    expect(() => {
      renderWithContext({
        messages: [msg] as unknown as IMessage[],
        departuresForMap: [],
      });
    }).not.toThrow();

    const vehicleMarkerCalls = (L.marker as vi.Mock).mock.calls.filter(
      ([coords]) => coords[0] === msg.lat && coords[1] === msg.long,
    );
    expect(vehicleMarkerCalls).toHaveLength(1);
  });

  it('should not crash when departuresForMap is undefined and an HSL vehicle message arrives', () => {
    // Regression: departuresForMap?.flat() produces undefined when the prop is
    // absent; getVehicle must not blow up when given undefined as the array.
    const msg = buildMessage({ route: 'HSL:456', lat: 60.18, long: 24.93 });

    expect(() => {
      renderWithContext({
        messages: [msg] as unknown as IMessage[],
        departuresForMap: undefined,
      });
    }).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// MQTT topic management
// ---------------------------------------------------------------------------
describe('MQTT topic updates', () => {
  it('calls changeTopics with the correct payload when refs and newTopics are set', () => {
    const topicRef = { current: ['/hfp/v2/journey/ongoing/#'] };
    const clientRef = { current: {} };
    const newTopics = ['/hfp/v2/journey/ongoing/+/#'];

    renderWithContext({ topicRef, clientRef, newTopics });

    expect(changeTopics).toHaveBeenCalledWith(
      {
        oldTopics: topicRef.current,
        client: clientRef.current,
        options: newTopics,
      },
      topicRef,
    );
  });

  it('does not call changeTopics when topicRef.current is null', () => {
    renderWithContext({
      topicRef: { current: null },
      clientRef: { current: {} },
      newTopics: ['/hfp/v2/journey/ongoing/#'],
    });
    expect(changeTopics).not.toHaveBeenCalled();
  });

  it('does not call changeTopics when newTopics is undefined', () => {
    renderWithContext({
      topicRef: { current: ['/hfp/v2/#'] },
      clientRef: { current: {} },
      newTopics: undefined,
    });
    expect(changeTopics).not.toHaveBeenCalled();
  });
});
