import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.scss";
import BusArrival from "./pages/BusArrival";
import Favourite from "./pages/Favourite";
import AboutUs from "./pages/AboutUs";
import BusServiceDetail from "./pages/BusServiceDetail";
import { useEffect, useState } from "react";
import { BusServiceModel, BusStopModel } from "./models/bus.model";
import BusServices from "./pages/BusService";
import BusArrivalDetail from "./pages/BusArrivalDetail";
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

const bannerOptions: BannerAdOptions = {
  adId: "ca-app-pub-6451703586668878/7345039996",
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  margin: 0,
  // isTesting: true,
};

const App: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState({} as BusServiceModel);
  const [selectedBusStop, setSelectedBusStop] = useState({} as BusStopModel);
  const [showAds, setShowAds] = useState(true);

  const setBusHandler = (bus: BusServiceModel) => {
    setSelectedBus(bus);
  };

  const setBusStopHandler = (busStop: BusStopModel) => {
    setSelectedBusStop(busStop);
  };

  const toggleAds = (adsBool: boolean) => {
    setShowAds(adsBool);
    if (adsBool) {
      AdMob.showBanner(bannerOptions);
    } else {
      AdMob.removeBanner();
    }
  };

  useEffect(() => {
    AdMob.initialize({
      requestTrackingAuthorization: true,
      // testingDevices: [""],
      // initializeForTesting: true,
    });
  }, []);

  return (
    <IonApp style={{ height: showAds ? "calc(100% - 60px)" : "100%" }}>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu showAds={showAds} setAds={toggleAds} />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/busarrival" />
            </Route>
            <Route path="/busservices" exact={true}>
              <BusServices setBus={setBusHandler} />
            </Route>
            <Route path="/busservices/:busno" exact={true}>
              <BusServiceDetail
                bus={selectedBus}
                setBusStop={setBusStopHandler}
              />
            </Route>
            <Route path="/busarrival" exact={true}>
              <BusArrival setBusStop={setBusStopHandler} />
            </Route>
            <Route path="/busarrival/:busarrivalno" exact={true}>
              <BusArrivalDetail
                busStop={selectedBusStop}
                setBusStop={setBusStopHandler}
              />
            </Route>
            <Route path="/fav" exact={true}>
              <Favourite />
            </Route>
            <Route path="/aboutus" exact={true}>
              <AboutUs />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
