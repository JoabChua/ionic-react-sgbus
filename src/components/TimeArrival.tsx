import { NextBus } from "../models/bus.model";

const diff_minutes = (dt1: string) => {
  if (dt1 === "") {
    return "NA";
  }
  var diff = (new Date().getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.floor(diff))
    ? Math.abs(Math.floor(diff)) + " mins"
    : "Arr";
};

const TimeArrival: React.FC<{ NextBus: NextBus }> = ({ NextBus }) => {
  return (
    <div className="time-icon">
      <div className={"time " + NextBus.Load}>
        {diff_minutes(NextBus.EstimatedArrival)}
      </div>
      {diff_minutes(NextBus.EstimatedArrival) !== "NA" && (
        <span className="additional-icon">
          {NextBus.Feature === "WAB" && (
            <img
              src="assets/img/wheelchair.png"
              alt="wc"
              width="20"
              height="20"
            />
          )}
          {!NextBus.Feature && "-"}
          {NextBus.Type === "SD" && (
            <img
              src="assets/img/singledeck.png"
              alt="bus"
              width="20"
              height="20"
            />
          )}
          {NextBus.Type === "DD" && (
            <img
              src="assets/img/doubledeck.png"
              alt="bus"
              width="20"
              height="20"
            />
          )}
          {NextBus.Type === "BD" && (
            <img src="assets/img/bendy.png" alt="bus" width="20" height="20" />
          )}
        </span>
      )}
    </div>
  );
};

export default TimeArrival;
