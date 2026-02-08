import { NativeModules, Platform } from 'react-native';
import { RNZoomUs } from '@zoom/meetingsdk-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zoom SDK credentials from environment
const ZOOM_SDK_KEY = 'ZtF1gvszTRaRUOWUbUBi2w';
const ZOOM_SDK_SECRET = 'v0dXYvEKyONTRRHHJJREoaXWfjNIuemD';
class ZoomService {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize Zoom SDK
     */
    async initialize() {
        if (this.initialized) {
            return { success: true };
        }

        try {
            const initializeResult = await RNZoomUs.initialize({
                clientKey: ZOOM_SDK_KEY,
                clientSecret: ZOOM_SDK_SECRET,
                domain: 'zoom.us',
            });

            console.log('Zoom SDK initialized:', initializeResult);
            this.initialized = true;
            return { success: true };
        } catch (error) {
            console.error('Zoom SDK initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Join a meeting as doctor (with account)
     * @param {Object} meetingData 
     * @param {string} meetingData.meetingNumber
     * @param {string} meetingData.password 
     * @param {string} meetingData.displayName
     * @param {string} meetingData.zoomAccessToken (ZAK token for host)
     */
    async joinMeetingAsHost(meetingData) {
        try {
            await this.initialize();

            const joinResult = await RNZoomUs.joinMeeting({
                userName: meetingData.displayName,
                meetingNumber: meetingData.meetingNumber,
                password: meetingData.password,
                zoomAccessToken: meetingData.zoomAccessToken, // ZAK token for authenticated join
                noAudio: false,
                noVideo: false,
            });

            console.log('Joined meeting as host:', joinResult);
            return { success: true, result: joinResult };
        } catch (error) {
            console.error('Failed to join meeting as host:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Join a meeting as participant (patient)
     * @param {Object} meetingData
     * @param {string} meetingData.meetingNumber
     * @param {string} meetingData.password
     * @param {string} meetingData.displayName
     */
    async joinMeetingAsParticipant(meetingData) {
        try {
            await this.initialize();

            const joinResult = await RNZoomUs.joinMeeting({
                userName: meetingData.displayName,
                meetingNumber: meetingData.meetingNumber,
                password: meetingData.password,
                noAudio: false,
                noVideo: false,
            });

            console.log('Joined meeting as participant:', joinResult);
            return { success: true, result: joinResult };
        } catch (error) {
            console.error('Failed to join meeting as participant:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Leave the current meeting
     */
    async leaveMeeting() {
        try {
            await RNZoomUs.leaveMeeting();
            return { success: true };
        } catch (error) {
            console.error('Failed to leave meeting:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new ZoomService();
