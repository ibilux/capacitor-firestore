#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CapacitorFirestorePlugin, "CapacitorFirestore",
           CAP_PLUGIN_METHOD(initializeFirestore, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signInWithCustomToken, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signOut, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(removeSnapshotListener, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(clearAllSnapshotListeners, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(deleteDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(addDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCollection, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(enableNetwork, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(disableNetwork, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getApp, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getFirestore, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(addDocumentSnapshotListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(addCollectionSnapshotListener, CAPPluginReturnCallback);
)
