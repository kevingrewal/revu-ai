import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revu AI</Text>
      <Text style={styles.tagline}>Smarter reviews. Better decisions.</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline}>
        <Text style={styles.buttonOutlineText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A0F0F",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4EF8B0",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#CFCFCF",
    marginBottom: 48,
  },
  button: {
    backgroundColor: "#4EF8B0",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: "#0A0F0F",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonOutline: {
    borderColor: "#4EF8B0",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
  },
  buttonOutlineText: {
    color: "#4EF8B0",
    fontSize: 18,
    fontWeight: "bold",
  },
});
