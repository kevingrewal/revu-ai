import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useFonts } from "expo-font";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    Avignon: require("../assets/fonts/Avignon.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Simulate load delay
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!loading && fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fontsLoaded]);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.title}>
          <Text style={styles.logoLetter}>R</Text>evu AI
        </Text>
        <ActivityIndicator size="large" color="#00E0FF" style={styles.spinner} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.homeContainer, { opacity: fadeAnim }]}> 
      <Text style={styles.loadedText}>Welcome to Revu AI</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 40,
    fontFamily: "Avignon",
    color: "#E0E0E0",
    textAlign: "center",
  },
  logoLetter: {
    fontSize: 60,
    color: "#00E0FF",
    fontWeight: "bold",
    marginRight: 5,
  },
  spinner: {
    marginTop: 20,
  },
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadedText: {
    fontSize: 24,
    color: "#00E0FF",
  },
});
