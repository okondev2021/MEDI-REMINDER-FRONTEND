let swRegistration: ServiceWorkerRegistration | null = null;

export const getSwRegistration =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!swRegistration && "serviceWorker" in navigator) {
      swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js?v=5"
      );
      console.log("✅ Service worker registered and cached");
    }
    return swRegistration;
  };
