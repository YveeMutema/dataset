import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const clinicList = [
  { name: 'Hurungwe District Hospital', ward: 'Karoi', latitude: -16.7942, longitude: 29.6779 },
  { name: 'Nyamepi Clinic', ward: 'Nyamepi', latitude: -16.5723, longitude: 29.8234 },
  { name: 'Mukwichi Clinic', ward: 'Mukwichi', latitude: -16.8931, longitude: 29.5402 },
  { name: 'Zimuto Clinic', ward: 'Zimuto', latitude: -16.8444, longitude: 29.5866 },
  { name: 'Magunje Clinic', ward: 'Magunje', latitude: -16.6505, longitude: 29.8078 }
];

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function ClinicLocatorScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('Getting your location...');
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);

  useEffect(() => {
    const loadLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Location permission denied. Showing nearby clinics by default.');
        setClinics(clinicList.map((clinic) => ({ ...clinic, distance: null })));
        return;
      }

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const currentCoords = current.coords;
      setLocation(currentCoords);
      setMessage('Nearby clinics from your current position:');

      const sorted = clinicList
        .map((clinic) => ({
          ...clinic,
          distance: getDistanceKm(currentCoords.latitude, currentCoords.longitude, clinic.latitude, clinic.longitude)
        }))
        .sort((a, b) => a.distance - b.distance);

      setClinics(sorted);
    };

    loadLocation().catch(() => {
      setMessage('Unable to fetch location. Showing clinics by default.');
      setClinics(clinicList.map((clinic) => ({ ...clinic, distance: null })));
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hurungwe Clinic Locator</Text>
      <Text style={styles.message}>{message}</Text>
      {location && (
        <View style={styles.card}>
          <Text style={styles.coord}>Latitude: {location.latitude.toFixed(6)}</Text>
          <Text style={styles.coord}>Longitude: {location.longitude.toFixed(6)}</Text>
        </View>
      )}
      {selectedClinic && (
        <View style={styles.selectionBanner}>
          <Text style={styles.selectionText}>Selected: {selectedClinic.name} ({selectedClinic.distance !== null ? `${selectedClinic.distance.toFixed(1)} km` : 'distance unavailable'})</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.list}>
        {clinics.map((clinic) => (
          <View key={clinic.name} style={styles.clinicCard}>
            <View style={styles.clinicHeader}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              {clinic.distance !== null ? (
                <Text style={styles.distanceText}>{clinic.distance.toFixed(1)} km</Text>
              ) : (
                <Text style={styles.distanceText}>Distance unavailable</Text>
              )}
            </View>
            <Text style={styles.clinicWard}>Ward: {clinic.ward}</Text>
            <Text style={styles.clinicCoords}>
              {clinic.latitude.toFixed(4)}, {clinic.longitude.toFixed(4)}
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                setSelectedClinic(clinic);
                navigation.navigate('Home', { selectedClinic: clinic });
              }}
            >
              <Text style={styles.selectButtonText}>Choose this clinic</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f6fbff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f4b8f', marginBottom: 16 },
  message: { fontSize: 16, color: '#4b5f78', marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#cbd9f0', marginBottom: 18 },
  coord: { fontSize: 16, color: '#122d45' },
  list: { paddingBottom: 32 },
  clinicCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#d7e0f2', marginBottom: 16 },
  clinicHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clinicName: { fontSize: 18, fontWeight: '700', color: '#102d53', flex: 1 },
  distanceText: { fontSize: 14, fontWeight: '700', color: '#1f4b8f' },
  clinicWard: { fontSize: 15, color: '#4b5f78', marginBottom: 4 },
  clinicCoords: { fontSize: 14, color: '#6c7b8f', marginBottom: 12 },
  selectButton: { backgroundColor: '#1f4b8f', padding: 12, borderRadius: 12, alignItems: 'center' },
  selectButtonText: { color: '#fff', fontWeight: '700' }
});
