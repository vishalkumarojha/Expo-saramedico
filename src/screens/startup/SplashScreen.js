import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// If you have expo-linear-gradient, you can uncomment and use it
// import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 3000); // 3 seconds splash

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* If adding gradient: <LinearGradient colors={[COLORS.primary, '#FFFFFF']} style={styles.container}> */}
            <View style={styles.content}>
                <Text style={styles.title}>SaraMedico</Text>
            </View>
            {/* </LinearGradient> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 1,
    }
});
