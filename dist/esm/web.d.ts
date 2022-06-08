import { WebPlugin } from '@capacitor/core';
import type { CallbackId, CapacitorFirestorePlugin, CollectionSnapshot, CollectionSnapshotCallback, CollectionReference, CustomToken, DocumentSnapshot, DocumentSnapshotCallback, DocumnentReference, FirestoreConfig, RemoveSnapshotListener } from './definitions';
export declare class CapacitorFirestoreWeb extends WebPlugin implements CapacitorFirestorePlugin {
    private app;
    private firestore;
    private subscriptions;
    initializeFirestore(options: FirestoreConfig): Promise<void>;
    addDocumentSnapshotListener<T>(options: DocumnentReference, callback: DocumentSnapshotCallback<T>): Promise<CallbackId>;
    getDocument<T>(options: DocumnentReference): Promise<DocumentSnapshot<T>>;
    addCollectionSnapshotListener<T>(options: CollectionReference, callback: CollectionSnapshotCallback<T>): Promise<CallbackId>;
    getCollection<T>(options: CollectionReference): Promise<CollectionSnapshot<T>>;
    removeSnapshotListener(options: RemoveSnapshotListener): Promise<void>;
    signInWithCustomToken(options: CustomToken): Promise<void>;
}
