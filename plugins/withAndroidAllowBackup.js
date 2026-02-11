const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withAndroidAllowBackup(config) {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;

        // Ensure the tools namespace is available
        if (!androidManifest.manifest.$) {
            androidManifest.manifest.$ = {};
        }
        androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

        const mainApplication = androidManifest.manifest.application[0];

        // Add 'tools:replace' to override the conflict
        mainApplication.$['tools:replace'] = 'android:allowBackup';

        // Set allowBackup to false to match Zoom SDK requirements
        mainApplication.$['android:allowBackup'] = 'false';

        return config;
    });
};
