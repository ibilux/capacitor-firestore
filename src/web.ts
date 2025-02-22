import { WebPlugin } from "@capacitor/core";
import { initializeApp, deleteApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import type { Firestore, Query, Unsubscribe } from "firebase/firestore";
import {
  enableNetwork,
  disableNetwork,
  initializeFirestore,
  terminate,
  enableIndexedDbPersistence,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  CACHE_SIZE_UNLIMITED,
} from "firebase/firestore";

import type {
  CallbackId,
  CapacitorFirestorePlugin,
  CollectionSnapshot,
  CollectionSnapshotCallback,
  CustomToken,
  DocumentSnapshot,
  DocumentSnapshotCallback,
  DocumentReference,
  FirestoreConfig,
  RemoveSnapshotListener,
  UpdateDocument,
  SetDocument,
  AddDocument,
  DocumnentQuery,
  CollectionQuery,
  PendingActions,
} from "./definitions";

export class CapacitorFirestoreWeb extends WebPlugin implements CapacitorFirestorePlugin {
  private app: FirebaseApp | null = null;
  private firestore: Firestore | null = null;

  private subscriptions: { [id: string]: Unsubscribe } = {};
  private pendingActions: number = 0;

  public getPendingActions(): Promise<PendingActions> {
    return Promise.resolve({
      count: this.pendingActions,
    });
  }

  public async initializeFirestore(options: FirestoreConfig): Promise<void> {
    if (this.app !== null) {
      await deleteApp(this.app);
    }
    if (this.firestore !== null) {
      await terminate(this.firestore);
    }

    this.app = initializeApp(
      {
        apiKey: options.apiKey,
        appId: options.applicationId,
        projectId: options.projectId,
      },
      "CapacitorFirestore"
    );

    this.firestore = initializeFirestore(this.app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });

    await enableIndexedDbPersistence(this.firestore);
  }

  public addDocumentSnapshotListener<T>(
    options: DocumnentQuery,
    callback: DocumentSnapshotCallback<T>
  ): Promise<CallbackId> {
    if (this.firestore === null) {
      return Promise.reject("Firestore not initialized");
    }

    const unSubFunc = onSnapshot(doc(this.firestore, options.reference), (snapshot) => {
      callback({
        id: snapshot.id,
        path: snapshot.ref.path,
        data: snapshot.exists() ? (snapshot.data() as T) : null,
      });
    });

    const id = new Date().getTime().toString();
    this.subscriptions[id] = unSubFunc;

    return Promise.resolve(id);
  }

  public async getDocument<T>(options: DocumnentQuery): Promise<DocumentSnapshot<T>> {
    if (this.firestore === null) {
      return Promise.reject("Firestore not initialized");
    }

    const snapshot = await getDoc(doc(this.firestore, options.reference));
    return {
      id: snapshot.id,
      path: snapshot.ref.path,
      data: snapshot.exists() ? (snapshot.data() as T) : null,
    };
  }

  public updateDocument<T>(options: UpdateDocument<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.firestore === null) {
        return reject("Firestore not initialized");
      }

      this.pendingActions++;

      updateDoc(doc(this.firestore, options.reference), options.data as T)
        .then(() => {
          this.pendingActions--;
        })
        .catch((err) => {
          this.pendingActions--;
          reject(err);
        });
      resolve();
    });
  }

  public setDocument<T>(options: SetDocument<T>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.firestore === null) {
        return reject("Firestore not initialized");
      }

      this.pendingActions++;

      setDoc(doc(this.firestore, options.reference), options.data as T, {
        merge: options.merge,
      })
        .then(() => {
          this.pendingActions--;
        })
        .catch((err) => {
          this.pendingActions--;
          reject(err);
        });
      resolve();
    });
  }

  public deleteDocument(options: DocumnentQuery): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.firestore === null) {
        return reject("Firestore not initialized");
      }

      this.pendingActions++;

      deleteDoc(doc(this.firestore, options.reference))
        .then(() => {
          this.pendingActions--;
        })
        .catch((err) => {
          this.pendingActions--;
          reject(err);
        });
      resolve();
    });
  }

  public addDocument<T>(options: AddDocument<T>): Promise<DocumentReference> {
    return new Promise((resolve, reject) => {
      if (this.firestore === null) {
        return reject("Firestore not initialized");
      }

      this.pendingActions++;
      const docReference = doc(collection(this.firestore, options.reference));

      setDoc(docReference, options.data as T)
        .then(() => {
          this.pendingActions--;
        })
        .catch((err) => {
          this.pendingActions--;
          reject(err);
        });

      resolve({
        id: docReference.id,
        path: docReference.path,
      });
    });
  }

  public addCollectionSnapshotListener<T>(
    options: CollectionQuery,
    callback: CollectionSnapshotCallback<T>
  ): Promise<CallbackId> {
    if (this.firestore === null) {
      return Promise.reject("Firestore not initialized");
    }

    let collectionQuery: Query;
    if (options.queryConstraints) {
      const constraints = options.queryConstraints.map((constraint) =>
        where(constraint.fieldPath, constraint.opStr, constraint.value)
      );
      collectionQuery = query(collection(this.firestore, options.reference), ...constraints);
    } else {
      collectionQuery = query(collection(this.firestore, options.reference));
    }

    const unSubFunc = onSnapshot(collectionQuery, (snapshot) => {
      callback({
        collection: snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            path: doc.ref.path,
            data: doc.data() as T,
          };
        }),
      });
    });

    const id = new Date().getTime().toString();
    this.subscriptions[id] = unSubFunc;

    return Promise.resolve(id);
  }

  public async getCollection<T>(options: CollectionQuery): Promise<CollectionSnapshot<T>> {
    if (this.firestore === null) {
      return Promise.reject("Firestore not initialized");
    }

    let collectionQuery: Query;
    if (options.queryConstraints) {
      const constraints = options.queryConstraints.map((constraint) =>
        where(constraint.fieldPath, constraint.opStr, constraint.value)
      );
      collectionQuery = query(collection(this.firestore, options.reference), ...constraints);
    } else {
      collectionQuery = query(collection(this.firestore, options.reference));
    }

    const snapshot = await getDocs(collectionQuery);

    return {
      collection: snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          path: doc.ref.path,
          data: doc.data() as T,
        };
      }),
    };
  }

  public removeSnapshotListener(options: RemoveSnapshotListener): Promise<void> {
    const unSubFunc = this.subscriptions[options.callbackId];

    if (unSubFunc === undefined) {
      return Promise.reject("No callback with id " + options.callbackId);
    }

    unSubFunc();
    delete this.subscriptions[options.callbackId];

    return Promise.resolve();
  }

  public clearAllSnapshotListeners(): Promise<void> {
    for (const item in this.subscriptions) {
      const unSubFunc = this.subscriptions[item];
      unSubFunc();

      delete this.subscriptions[item];
    }

    return Promise.resolve();
  }

  public async signInWithCustomToken(options: CustomToken): Promise<void> {
    if (this.app === null) {
      return Promise.reject("app not initialized");
    }

    const auth = getAuth(this.app);
    await signInWithCustomToken(auth, options.token);
  }

  public signOut(): Promise<void> {
    if (this.app === null) {
      return Promise.reject("app not initialized");
    }

    const auth = getAuth(this.app);
    return signOut(auth);
  }

  public enableNetwork(): Promise<void> {
    if (this.firestore === null) {
      return Promise.reject("Firestore not initialized");
    }

    return enableNetwork(this.firestore);
  }

  public disableNetwork(): Promise<void> {
    if (this.firestore === null) {
      return Promise.reject("Firestore not initialized");
    }

    return disableNetwork(this.firestore);
  }

  public getApp(): { app: FirebaseApp | null; } {
    return { app: this.app };
  }

  public getFirestore(): { firestore: Firestore | null; } {
    return { firestore: this.firestore };
  }
}
