import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
} from "@ionic/react";

const Favourite: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Favourite</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="no-info">Coming Soon</div>
      </IonContent>
    </IonPage>
  );
};

export default Favourite;
