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

const GoogleMap: React.FC<{
  coord: GoogleMapStartingPoint;
  setBusStopList(filterbs: BusStopModel[]): void;
  fetchBusStops(): void;
  setCoord(coord: GoogleMapStartingPoint): void;
}> = ({ coord, setBusStopList, fetchBusStops, setCoord }) => {
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

    let parseBusStops: BusStopModel[];
    let filteredBS: BusStopModel[] = [];
    const busstopstring = localStorage.getItem("allbusstops");
    if (busstopstring) {
      parseBusStops = JSON.parse(busstopstring);
      setUnfilteredBusStops(parseBusStops);
      if (parseBusStops.length === 5053) {
        filteredBS = filterBusStops(parseBusStops, coord);
        setBusStopList(filteredBS);
      } else {
        fetchBusStops();
      }
    } else {
      fetchBusStops();
    }
    const bsMarkers: google.maps.Marker[] = [];
    filteredBS.forEach((bs: BusStopModel) => {
      bsMarkers.push(
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
    setBusStopMarkers(bsMarkers);

    setCenterMarker(() => [
      new google.maps.Marker({
        position: coord.center,
        map,
        icon: {
          url: "https://img.icons8.com/dusk/64/000000/marker.png",
          scaledSize: new google.maps.Size(32, 32),
        },
      }),
    ]);
  };

  const updateMarkers = (ev: google.maps.Map) => {
    const newCoord = {
      center: { lat: ev.getCenter()!.lat(), lng: ev.getCenter()!.lng() },
      zoom: ev.getZoom()!,
    };
    setCoord(newCoord);

    centerMarker.forEach((marker) => marker.setMap(null));
    setCenterMarker(() => [
      new google.maps.Marker({
        position: { lat: ev.getCenter()!.lat(), lng: ev.getCenter()!.lng() },
        map: gMap,
        icon: {
          url: "https://img.icons8.com/dusk/64/000000/marker.png",
          scaledSize: new google.maps.Size(32, 32),
        },
      }),
    ]);

    busStopMarkers.forEach((marker) => marker.setMap(null));
    const bsMarkers: google.maps.Marker[] = [];
    let filteredBS = filterBusStops(unfilteredBusStops, newCoord);
    setBusStopList(filteredBS);

    filteredBS.forEach((bs: BusStopModel) => {
      bsMarkers.push(
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
    setBusStopMarkers(bsMarkers);
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
