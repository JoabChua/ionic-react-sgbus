import { BusStopModel } from "../models/bus.model";
import { IonItem, IonList } from "@ionic/react";
import { useContext } from "react";
import BusContext from "../store/BusContext";

const BusStopList: React.FC<{
  busStops: BusStopModel[];
}> = ({ busStops }) => {
  const busCtx = useContext(BusContext);
  const newList = [...busStops].sort(
    ({ distance: a }, { distance: b }) => a! - b!,
  );

  return (
    <div>
      {newList.length > 0 && (
        <IonList>
          {newList.map((busStop) => {
            const bd = busStop.Description.includes("/")
              ? busStop.Description.replace("/", "_")
              : busStop.Description;
            const routeLink = `/busarrival/${busStop.BusStopCode}/${bd}/${busStop.RoadName}`;

            return (
              <IonItem
                key={busStop.BusStopCode + busStop.Description}
                routerLink={routeLink}
                routerDirection="forward"
                onClick={() => busCtx.setBusStop(busStop)}
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
      )}
      {newList.length === 0 && (
        <div className="no-info">No Bus Stop Available</div>
      )}
    </div>
  );
};

export default BusStopList;
