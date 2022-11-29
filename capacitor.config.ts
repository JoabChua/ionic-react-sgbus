import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchAutoHide: false,
      androidSplashResourceName: "splash",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      layoutName: "launch_screen",
    },
  },
  ios: {
    scheme: "TransportGuard",
  },
  webDir: "build",
  bundledWebRuntime: false,
  appId: "io.devjo.transport",
  appName: "TransportGuard",
};

export default config;
