import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Card, Button, Avatar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { patientAPI } from '../../services/api';
import ErrorHandler from '../../services/errorHandler';

/**
 * Doctor Search Screen
 * 
 * Allows patients to search for doctors by specialty or name
 */
export default function DoctorSearchScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    /**
     * Search for doctors
     */
    const searchDoctors = async () => {
        if (!searchQuery && !specialty) {
            Alert.alert('Search Required', 'Please enter a doctor name or select a specialty');
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const params = {};
            if (searchQuery) params.query = searchQuery;
            if (specialty) params.specialty = specialty;

            const response = await patientAPI.searchDoctors(params);
            setDoctors(response.data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            const errorInfo = ErrorHandler.handleError(error);
            Alert.alert('Search Failed', errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle specialty filter
     */
    const filterBySpecialty = (selectedSpecialty) => {
        setSpecialty(selectedSpecialty);
        // Auto-search when specialty is selected
        setTimeout(() => {
            searchDoctors();
        }, 100);
    };

    /**
     * Navigate to doctor profile or booking
     */
    const handleDoctorPress = (doctor) => {
        navigation.navigate('AppointmentBooking', { doctor });
    };

    /**
     * Render doctor card
     */
    const renderDoctorCard = ({ item }) => (
        <TouchableOpacity onPress={() => handleDoctorPress(item)}>
            <Card style={styles.doctorCard}>
                <Card.Content style={styles.cardContent}>
                    <Avatar.Image
                        size={60}
                        source={
                            item.photo_url
                                ? { uri: item.photo_url }
                                : { uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name || 'User') + '&background=random' }
                        }
                        style={styles.avatar}
                    />
                    <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{item.name}</Text>
                        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                        <Chip mode="outlined" style={styles.chip}>
                            Available
                        </Chip>
                    </View>
                    <Text style={styles.arrowIcon}>›</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Search Bar */}
                <Searchbar
                    placeholder="Search by doctor name"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    onSubmitEditing={searchDoctors}
                    style={styles.searchBar}
                />

                {/* Specialty Filters */}
                <View style={styles.specialtyContainer}>
                    <Text style={styles.specialtyLabel}>Filter by Specialty:</Text>
                    <View style={styles.chipContainer}>
                        <Chip
                            selected={specialty === 'Cardiology'}
                            onPress={() => filterBySpecialty('Cardiology')}
                            style={styles.specialtyChip}
                        >
                            Cardiology
                        </Chip>
                        <Chip
                            selected={specialty === 'Dermatology'}
                            onPress={() => filterBySpecialty('Dermatology')}
                            style={styles.specialtyChip}
                        >
                            Dermatology
                        </Chip>
                        <Chip
                            selected={specialty === 'Pediatrics'}
                            onPress={() => filterBySpecialty('Pediatrics')}
                            style={styles.specialtyChip}
                        >
                            Pediatrics
                        </Chip>
                        <Chip
                            selected={specialty === 'Orthopedics'}
                            onPress={() => filterBySpecialty('Orthopedics')}
                            style={styles.specialtyChip}
                        >
                            Orthopedics
                        </Chip>
                        <Chip
                            selected={specialty === ''}
                            onPress={() => {
                                setSpecialty('');
                                setDoctors([]);
                                setSearched(false);
                            }}
                            style={styles.specialtyChip}
                        >
                            Clear
                        </Chip>
                    </View>
                </View>

                {/* Loading Indicator */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6200ee" />
                        <Text style={styles.loadingText}>Searching doctors...</Text>
                    </View>
                )}

                {/* Results List */}
                {!loading && searched && (
                    <FlatList
                        data={doctors}
                        renderItem={renderDoctorCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No doctors found</Text>
                                <Text style={styles.emptySubtext}>
                                    Try adjusting your search criteria
                                </Text>
                            </View>
                        }
                    />
                )}

                {/* Initial State */}
                {!loading && !searched && (
                    <View style={styles.initialContainer}>
                        <Text style={styles.initialText}>
                            Search for doctors by name or select a specialty
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    searchBar: {
        margin: 16,
        elevation: 2,
    },
    specialtyContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    specialtyLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    specialtyChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        padding: 16,
    },
    doctorCard: {
        marginBottom: 12,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 16,
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    doctorSpecialty: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    chip: {
        alignSelf: 'flex-start',
    },
    arrowIcon: {
        fontSize: 32,
        color: '#999',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 48,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
    initialContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    initialText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});
