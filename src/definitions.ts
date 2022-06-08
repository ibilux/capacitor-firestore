/// <reference types="@capacitor/cli" />

declare module "@capacitor/cli" {
  export interface PluginsConfig {
    CapacitorFirestore?: FirestoreConfig;
  }
}

export interface FirestoreConfig {
  /**
   * Set the GCP/Firebase project id
   *
   * @since 1.0.0
   * @example "my-first-project"
   */
  projectId?: string;

  /**
   * Set the Firebase application id
   *
   * @since 1.0.0
   * @example "1:00000000000:web:abc00000000000000000"
   */
  applicationId?: string;

  /**
  * Set the Firebase api key
  *
  * @since 1.0.0
  * @example "XxxxxxxxxxxXXxxxxxxxxx"
  */
  apiKey?: string;
}

export type CallbackId = string;

export type QueryOperators = "==" | ">=" | "<=" | "<" | ">" | "array-contains";

export function createQueryConstraint(field: string, operator: QueryOperators, value: any): QueryConstraint {
  return {
    fieldPath: field,
    opStr: operator,
    value: value
  };
}

export interface QueryConstraint {
  fieldPath: string;
  opStr: QueryOperators;
  value: any;
}

export interface CollectionReference extends DocumnentReference {
  queryConstraints?: QueryConstraint[];
}

export interface DocumnentReference {
  reference: string;
}

export interface DocumentSnapshot<T> {
  /**
  * The id of the document.
  *
  * @since 1.0.0
  */
  id: string;

  /**
   * The fields of the document or null if the document doesn't exist.
   *
   * @since 1.0.0
   */
  data: T | null;
}

export interface CollectionSnapshot<T> {
  collection: DocumentSnapshot<T>[];
}

export interface CustomToken {
  token: string;
}

export interface RemoveSnapshotListener {
  callbackId: CallbackId;
}

export interface UpdateDocument<T> extends DocumnentReference {
  data: T;
}


export type DocumentSnapshotCallback<T> = (data: DocumentSnapshot<T> | null, err?: any) => void;

export type CollectionSnapshotCallback<T> = (data: CollectionSnapshot<T> | null, err?: any) => void;

export interface CapacitorFirestorePlugin {
  /**
   * Configure the firestore instance with new configuration options.
   * @param options 
   */
  initializeFirestore(options: FirestoreConfig): Promise<void>;

  /**
   * Login to firestore using a customer JWT token.
   * @param options 
   */
  signInWithCustomToken(options: CustomToken): Promise<void>;

  /**
    * Reads the document referred to by this DocumentReference
    * @param options 
    * @returns The document snapshot
    */
  getDocument<T>(options: DocumnentReference): Promise<DocumentSnapshot<T>>;

  /**
    * Reads the document referred to by this DocumentReference
    * @param options 
    * @returns The document snapshot
    */
  updateDocument<T>(options: UpdateDocument<T>): Promise<void>;

  /**
   * Listen for snapshot changes on a document.
   * @param options 
   * @param callback
   * @returns The callback id which can be used to remove the listener.
   */
  addDocumentSnapshotListener<T>(options: DocumnentReference, callback: DocumentSnapshotCallback<T>): Promise<CallbackId>;

  /**
  * Executes the query and returns the results as a CollectionSnapshot
  * @param options 
  * @returns The collection snapshot
  */
  getCollection<T>(options: CollectionReference): Promise<CollectionSnapshot<T>>;

  /**
   * Listen for snapshot changes on a collection.
   * @param options 
   * @param callback 
   * @returns The callback id which can be used to remove the listener.
   */
  addCollectionSnapshotListener<T>(options: CollectionReference, callback: CollectionSnapshotCallback<T>): Promise<CallbackId>;

  /**
   * Stop listening for snapshot changes on a document or collection.
   * @param options
   */
  removeSnapshotListener(options: RemoveSnapshotListener): Promise<void>;
}
