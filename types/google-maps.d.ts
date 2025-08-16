declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latlng: LatLng): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
      setOptions(options: MapOptions): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: MapTypeId;
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      scrollwheel?: boolean;
      gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latlng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      getPosition(): LatLng | undefined;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
      clickable?: boolean;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
      anchor?: Point;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    enum MapTypeId {
      HYBRID = 'hybrid',
      ROADMAP = 'roadmap',
      SATELLITE = 'satellite',
      TERRAIN = 'terrain',
    }

    function importLibrary(library: 'maps'): Promise<MapsLibrary>;
    function importLibrary(library: 'marker'): Promise<MarkerLibrary>;
    function importLibrary(library: string): Promise<any>;

    interface MapsLibrary {
      Map: typeof Map;
      LatLng: typeof LatLng;
      LatLngBounds: typeof LatLngBounds;
    }

    interface MarkerLibrary {
      Marker: typeof Marker;
    }

    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          options?: AutocompleteOptions,
        );
        addListener(eventName: string, handler: () => void): void;
        getPlace(): PlaceResult;
        getBounds(): LatLngBounds | undefined;
        getFields(): string[] | undefined;
        setBounds(bounds: LatLngBounds): void;
        setComponentRestrictions(restrictions: ComponentRestrictions): void;
        setFields(fields: string[]): void;
        setOptions(options: AutocompleteOptions): void;
        setTypes(types: string[]): void;
        clearInstanceListeners(): void;
        bindTo(key: string, target: any): void;
        changed(key: string): void;
        get(key: string): any;
        notify(key: string): void;
        set(key: string, value: any): void;
        setValues(values: any): void;
        unbind(key: string): void;
        unbindAll(): void;
      }

      interface AutocompleteOptions {
        types?: string[];
        componentRestrictions?: ComponentRestrictions;
        fields?: string[];
        bounds?: LatLngBounds;
        strictBounds?: boolean;
      }

      interface ComponentRestrictions {
        country?: string | string[];
        administrativeArea?: string;
        locality?: string;
        postalCode?: string;
      }

      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        geometry?: PlaceGeometry;
      }

      interface PlaceGeometry {
        location?: LatLng;
      }
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngBounds {
      contains(latLng: LatLng): boolean;
      equals(other: LatLngBounds): boolean;
      extend(point: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds): boolean;
      isEmpty(): boolean;
      toJSON(): object;
      toString(): string;
      toUrlValue(precision?: number): string;
      toSpan(): LatLng;
      union(other: LatLngBounds): LatLngBounds;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}

export {};
