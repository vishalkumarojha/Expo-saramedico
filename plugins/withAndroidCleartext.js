const { withAndroidManifest } = require('expo/config-plugins');

/**
 * Expo Config Plugin to enable cleartext traffic on Android.
 * This is required for connecting to HTTP APIs in production builds.
 * Uses tools:replace to override conflicts with libraries like Zoom SDK.
 */
module.exports = function withAndroidCleartext(config) {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;

        // Ensure the tools namespace is available
        if (!androidManifest.manifest.$) {
            androidManifest.manifest.$ = {};
        }
        androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

        const mainApplication = androidManifest.manifest.application[0];
        if (!mainApplication.$) {
            mainApplication.$ = {};
        }

        // Handle tools:replace to avoid manifest merger conflicts
        const existingReplace = mainApplication.$['tools:replace'];
        const attributeToReplace = 'android:usesCleartextTraffic';

        if (existingReplace) {
            if (!existingReplace.includes(attributeToReplace)) {
                mainApplication.$['tools:replace'] = `${existingReplace},${attributeToReplace}`;
            }
        } else {
            mainApplication.$['tools:replace'] = attributeToReplace;
        }

        // Enable cleartext traffic
        mainApplication.$['android:usesCleartextTraffic'] = 'true';

        return config;
    });
};
