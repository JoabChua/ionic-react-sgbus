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
import BusServices from "./pages/BusService";
import BusArrivalDetail from "./pages/BusArrivalDetail";
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";
import BusContextProvider from "./store/BusProvider";
import { isPlatform } from "@ionic/react";

const bannerOptions: BannerAdOptions = {
  adId: `${
    isPlatform("android")
      ? "ca-app-pub-6451703586668878/6992081542"
      : "ca-app-pub-6451703586668878/2263349109"
  }`,
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  margin: 0,
  // isTesting: true,
};

const App: React.FC = () => {
  const [showAds, setShowAds] = useState(false);

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
      testingDevices: [
        "3FDE6E5ED9F17CB30BB8F0D8B5B2CFDF",
        "84F6767A-8FE5-4743-9357-BBA3B252EAC9",
        "de441949487c4cd620c2e516f9d415defada873b",
        "DA0E2101929E866A",
      ],
      // initializeForTesting: true,
    }).then(() => {
      // AdMob.showBanner(bannerOptions);
      // AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (info) => {
      //   alert(JSON.stringify(info));
      // });
    });
  }, []);

  return (
    <BusContextProvider>
      <IonApp
        style={{
          height: showAds ? `90%` : "100%",
        }}
      >
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu showAds={showAds} setAds={toggleAds} />
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Redirect to="/busarrival" />
              </Route>
              <Route path="/busservices" exact={true}>
                <BusServices />
              </Route>
              <Route path="/busservices/:busServiceNo" exact={true}>
                <BusServiceDetail />
              </Route>
              <Route path="/busarrival" exact={true}>
                <BusArrival />
              </Route>
              <Route
                path="/busarrival/:busStopCode/:busStopName/:roadName"
                exact={true}
              >
                <BusArrivalDetail />
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
    </BusContextProvider>
  );
};

export default App;
