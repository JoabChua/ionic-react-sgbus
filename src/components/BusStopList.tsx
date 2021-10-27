import { BusStopModel } from "../models/bus.model";
import { IonItem, IonList } from "@ionic/react";

const BusStopList: React.FC<{
  busStops: BusStopModel[];
  setBusStop(busStop: BusStopModel): void;
}> = ({ busStops, setBusStop }) => {
  const newList = [...busStops].sort(
    ({ distance: a }, { distance: b }) => a! - b!,
  );

  return (
    <IonList>
      {newList.map((busStop) => {
        const routeLink = `/busarrival/${busStop.BusStopCode}`;
        return (
          <IonItem
            key={busStop.BusStopCode + busStop.Description}
            routerLink={routeLink}
            routerDirection="forward"
            onClick={() => setBusStop(busStop)}
          >
            <div className="stop">
              <div className="left">
                <div className="desc">{busStop.Description}</div>
                <div className="road">{busStop.RoadName}</div>
              </div>
              <div className="code">{busStop.BusStopCode}</div>
            </div>
          </IonItem>
        );
      })}
    </IonList>
  );
};

export default BusStopList;
