export interface RouteObject {
  destination: string;
  duration: string;
  distance: string;
  travelMode: 'DRIVE' | 'TRANSIT' | 'WALK' | 'BICYCLE';
  polyline?: string;
  transitDetails?: string;
}

export interface EvaluationObject {
  _id: string;
  address: string;
  routes: RouteObject[];
  createdAt?: Date;
}

