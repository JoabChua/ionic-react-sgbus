import GoogleMapReact from "google-map-react";
import { useState } from "react";
import { BKUP_MAP_KEY } from "../configs/bus.config";
import { BusStopModel } from "../models/bus.model";
import { GoogleMapStartingPoint } from "../pages/BusArrival";

const filterBusStops = (
  busStops: BusStopModel[],
  coord: GoogleMapStartingPoint,
) => {
  const center = new google.maps.LatLng(coord.center.lat, coord.center.lng);
  const filterbs = busStops.filter((bs: BusStopModel) => {
    const markerLoc = new google.maps.LatLng(bs.Latitude, bs.Longitude);
    const distanceKM =
      google.maps.geometry.spherical.computeDistanceBetween(markerLoc, center) /
      1000;
    bs.distance = distanceKM;
    if (distanceKM < 0.5) {
      return bs;
    }
  });
  return filterbs;
};

const setOriginMarker = (
  setCenterMarker: any,
  center: { lat: number; lng: number },
  map: google.maps.Map,
) => {
  setCenterMarker(() => [
    new google.maps.Marker({
      position: center,
      map,
      icon: {
        url: "https://img.icons8.com/dusk/64/000000/marker.png",
        scaledSize: new google.maps.Size(32, 32),
      },
    }),
  ]);
};

const GoogleMap: React.FC<{
  coord: GoogleMapStartingPoint;
  setBusStopList(filterbs: BusStopModel[]): void;
  setCoord(coord: GoogleMapStartingPoint): void;
}> = ({ coord, setBusStopList, setCoord }) => {
  const [gMap, setGMap] = useState<google.maps.Map>();
  const [centerMarker, setCenterMarker] = useState<google.maps.Marker[]>([]);
  const [busStopMarkers, setBusStopMarkers] = useState<google.maps.Marker[]>(
    [],
  );
  const [unfilteredBusStops, setUnfilteredBusStops] = useState<BusStopModel[]>(
    [],
  );

  const renderMarkers = (map: google.maps.Map) => {
    setGMap(map);

    let data: BusStopModel[] = require("../services/busstop.json");
    setUnfilteredBusStops(() => {
      const key = "BusStopCode";
      return [...new Map(data.map((item) => [item[key], item])).values()];
    });

    const tempBusStopMarkers: google.maps.Marker[] = [];
    let filteredBusStops = filterBusStops(data, coord);
    setBusStopList(filteredBusStops);

    filteredBusStops.forEach((bs: BusStopModel) => {
      tempBusStopMarkers.push(
        new google.maps.Marker({
          position: { lat: bs.Latitude, lng: bs.Longitude },
          map,
          icon: {
            url: "https://img.icons8.com/dusk/64/000000/bus--v2.png",
            scaledSize: new google.maps.Size(24, 24),
          },
        }),
      );
    });
    setBusStopMarkers(tempBusStopMarkers);

    setOriginMarker(setCenterMarker, coord.center, map);
  };

  const updateMarkers = (ev: google.maps.Map) => {
    const newCoord = {
      center: { lat: ev.getCenter()!.lat(), lng: ev.getCenter()!.lng() },
      zoom: ev.getZoom()!,
    };
    setCoord(newCoord);

    centerMarker.forEach((marker) => marker.setMap(null));
    busStopMarkers.forEach((marker) => marker.setMap(null));

    setOriginMarker(
      setCenterMarker,
      { lat: ev.getCenter()!.lat(), lng: ev.getCenter()!.lng() },
      gMap!,
    );

    const tempBusStopMarkers: google.maps.Marker[] = [];
    let filteredBusStops = filterBusStops(unfilteredBusStops, newCoord);
    setBusStopList(filteredBusStops);

    filteredBusStops.forEach((bs: BusStopModel) => {
      tempBusStopMarkers.push(
        new google.maps.Marker({
          position: { lat: bs.Latitude, lng: bs.Longitude },
          map: gMap,
          icon: {
            url: "https://img.icons8.com/dusk/64/000000/bus--v2.png",
            scaledSize: new google.maps.Size(24, 24),
          },
        }),
      );
    });
    setBusStopMarkers(tempBusStopMarkers);
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: BKUP_MAP_KEY,
        libraries: ["geometry"],
      }}
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        clickableIcons: false,
        zoomControl: false,
        styles: [
          {
            featureType: "transit.station.bus",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
      onDragEnd={($event) => updateMarkers($event)}
      center={coord.center}
      zoom={coord.zoom}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map }) => renderMarkers(map)}
    ></GoogleMapReact>
  );
};

export default GoogleMap;
