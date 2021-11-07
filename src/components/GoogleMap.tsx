import GoogleMapReact from "google-map-react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { BKUP_MAP_KEY } from "../configs/bus.config";
import { BusStopModel } from "../models/bus.model";
import { GoogleMapStartingPoint } from "../pages/BusArrival";
import "./GoogleMap.scss";

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
  setCenterMarker(
    () =>
      new google.maps.Marker({
        position: center,
        map,
        icon: {
          url: "assets/img/marker.png",
          scaledSize: new google.maps.Size(32, 32),
        },
      }),
  );
};

const infoWindow = (bs: BusStopModel) => {
  return `
      <a
        style="font-size: 16px; font-weight: 900; color: grey;"
        id="goTo">
        ${bs.Description}
      </a>
  `;
};

const filterBusListAndUpdateBusMarkers = (
  data: BusStopModel[],
  coord: GoogleMapStartingPoint,
  setBusStopList: any,
  map: google.maps.Map,
  setBusStopMarkers: any,
  setBusStop: any,
  history: any,
) => {
  const tempBusStopMarkers: google.maps.Marker[] = [];
  const tempInfoWindows: google.maps.InfoWindow[] = [];
  let filteredBusStops = filterBusStops(data, coord);
  setBusStopList(filteredBusStops);

  filteredBusStops.forEach((bs: BusStopModel) => {
    tempBusStopMarkers.push(
      new google.maps.Marker({
        position: { lat: bs.Latitude, lng: bs.Longitude },
        map,
        icon: {
          url: "assets/img/busstop.png",
          scaledSize: new google.maps.Size(24, 24),
        },
      }),
    );

    tempInfoWindows.push(
      new google.maps.InfoWindow({
        content: infoWindow(bs),
      }),
    );
  });

  let currentlyOpenInfoWindow: number | null;

  tempBusStopMarkers.forEach((marker, index) => {
    marker.addListener("click", () => {
      tempInfoWindows.forEach((iw) => iw.close());
      if (currentlyOpenInfoWindow !== index) {
        tempInfoWindows[index].open(map, marker);
        tempInfoWindows[index].addListener("domready", () => {
          document.getElementById("goTo")?.addEventListener("click", () => {
            setBusStop(filteredBusStops[index]);
            history.push("/busarrival/" + filteredBusStops[index].BusStopCode);
            tempInfoWindows.forEach((iw) => iw.close());
          });
        });
        currentlyOpenInfoWindow = index;
      } else {
        currentlyOpenInfoWindow = null;
      }
    });
  });

  setBusStopMarkers(tempBusStopMarkers);
};

const GoogleMap: React.FC<{
  coord: GoogleMapStartingPoint;
  setBusStopList(filterbs: BusStopModel[]): void;
  setCoord(coord: GoogleMapStartingPoint): void;
  setBusStop(busStop: BusStopModel): void;
  watchCoord: GoogleMapStartingPoint;
}> = ({ coord, setBusStopList, setCoord, setBusStop, watchCoord }) => {
  const history = useHistory();
  const [gMap, setGMap] = useState<google.maps.Map>();
  const [centerMarker, setCenterMarker] = useState<google.maps.Marker>();
  const watchPosRef = useRef<google.maps.Marker>();
  const [busStopMarkers, setBusStopMarkers] = useState<google.maps.Marker[]>(
    [],
  );
  const [unfilteredBusStops, setUnfilteredBusStops] = useState<BusStopModel[]>(
    [],
  );

  const renderMarkers = (map: google.maps.Map, maps: any) => {
    setGMap(map);

    let data: BusStopModel[] = require("../services/busstop.json");
    setUnfilteredBusStops(() => {
      const key = "BusStopCode";
      return [...new Map(data.map((item) => [item[key], item])).values()];
    });

    setOriginMarker(setCenterMarker, coord.center, map);
    filterBusListAndUpdateBusMarkers(
      data,
      coord,
      setBusStopList,
      map,
      setBusStopMarkers,
      setBusStop,
      history,
    );
  };

  const onDragEndHandler = (ev: google.maps.Map) => {
    const newCenter = {
      lat: ev.getCenter()!.lat(),
      lng: ev.getCenter()!.lng(),
    };
    const newCoord = {
      center: newCenter,
      zoom: ev.getZoom()!,
    };
    setCoord(newCoord);

    if (centerMarker) {
      centerMarker.setPosition(newCenter);
    }

    busStopMarkers.forEach((marker) => marker.setMap(null));
    filterBusListAndUpdateBusMarkers(
      unfilteredBusStops,
      newCoord,
      setBusStopList,
      gMap!,
      setBusStopMarkers,
      setBusStop,
      history,
    );
  };

  const updateMarker = (ev: google.maps.Map) => {
    const newCenter = {
      lat: ev.getCenter()!.lat(),
      lng: ev.getCenter()!.lng(),
    };
    if (centerMarker) {
      centerMarker.setPosition(newCenter);
    }
  };

  useEffect(() => {
    if (gMap && !watchPosRef.current && watchCoord) {
      watchPosRef.current = new google.maps.Marker({
        position: watchCoord.center,
        map: gMap,
        animation: 1,
        icon: {
          url: "assets/img/circle.png",
          scaledSize: new google.maps.Size(24, 24),
        },
      });
    }

    if (gMap && watchPosRef.current) {
      watchPosRef.current.setPosition(watchCoord.center);
    }
  }, [watchCoord, gMap]);

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
      onDragEnd={($event) => onDragEndHandler($event)}
      center={coord.center}
      zoom={coord.zoom}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
      onDrag={updateMarker}
    ></GoogleMapReact>
  );
};

export default GoogleMap;
