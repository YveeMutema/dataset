import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import SymptomCheckerScreen from './screens/SymptomCheckerScreen';
import ResultScreen from './screens/ResultScreen';
import HealthAdviceScreen from './screens/HealthAdviceScreen';
import HistoryScreen from './screens/HistoryScreen';
import ClinicLocatorScreen from './screens/ClinicLocatorScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      setLoading(false);
    };
    restoreAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={Platform.OS === 'web' ? styles.webWrapper : styles.appWrapper}>
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerStyle={styles.webScrollContent} style={styles.webScroll}>
          <View style={styles.webWrapperInner}>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerTintColor: '#1f4b8f',
                  headerTitle: '',
                  headerStyle: {
                    backgroundColor: '#f7fbff',
                    shadowColor: 'transparent',
                    elevation: 0,
                  },
                }}
              >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Auth">
                  {(props) => <AuthScreen {...props} setUserToken={setUserToken} />}
                </Stack.Screen>
                <Stack.Screen name="Home">
                  {(props) => <HomeScreen {...props} userToken={userToken} setUserToken={setUserToken} />}
                </Stack.Screen>
                <Stack.Screen name="SymptomChecker">
                  {(props) => <SymptomCheckerScreen {...props} userToken={userToken} />}
                </Stack.Screen>
                <Stack.Screen name="Result" component={ResultScreen} />
                <Stack.Screen name="HealthAdvice" component={HealthAdviceScreen} />
                <Stack.Screen name="History">
                  {(props) => <HistoryScreen {...props} userToken={userToken} />}
                </Stack.Screen>
                <Stack.Screen name="ClinicLocator" component={ClinicLocatorScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.appWrapper}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: true,
                headerBackTitleVisible: false,
                headerTintColor: '#1f4b8f',
                headerTitle: '',
                headerStyle: {
                  backgroundColor: '#f7fbff',
                  shadowColor: 'transparent',
                  elevation: 0,
                },
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Auth">
                {(props) => <AuthScreen {...props} setUserToken={setUserToken} />}
              </Stack.Screen>
              <Stack.Screen name="Home">
                {(props) => <HomeScreen {...props} userToken={userToken} setUserToken={setUserToken} />}
              </Stack.Screen>
              <Stack.Screen name="SymptomChecker">
                {(props) => <SymptomCheckerScreen {...props} userToken={userToken} />}
              </Stack.Screen>
              <Stack.Screen name="Result" component={ResultScreen} />
              <Stack.Screen name="HealthAdvice" component={HealthAdviceScreen} />
              <Stack.Screen name="History">
                {(props) => <HistoryScreen {...props} userToken={userToken} />}
              </Stack.Screen>
              <Stack.Screen name="ClinicLocator" component={ClinicLocatorScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appWrapper: { flex: 1 },
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  webScroll: {
    width: '100%',
  },
  webScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingVertical: 20,
  },
  webWrapperInner: {
    width: 420,
    minHeight: 780,
    maxWidth: '100%',
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
});
