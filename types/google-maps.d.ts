declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
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
