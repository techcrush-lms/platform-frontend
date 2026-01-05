import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;

export const requestFirebaseNotificationPermission = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted' && messaging) {
            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
            });
            return token || null;
        } else {
            console.warn('Notification permission not granted or messaging is null');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

export const onFirebaseMessageListener = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!messaging) {
            reject('Firebase messaging is not supported in this environment.');
            return;
        }

        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
};
