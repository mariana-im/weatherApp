import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
  Keyboard,
  Image,
  ScrollView,
} from "react-native";
import { Card } from "react-native-paper";

const API_KEY = "9060cf854dd53ae6ef857a97df7ab335";

export default function App() {
  const [city, setCity] = useState("Hermosillo");
  const [inputCity, setInputCity] = useState("Hermosillo");
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    if (!cityName) {
      setForecast([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      setForecast(data.list);
      setCity(cityName);
    } catch (err) {
      setError(err.message);
      setForecast([]); // clear screen
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchWeather(inputCity);
    }, 1000);
    return () => clearTimeout(delay);
  }, [inputCity]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a city..."
        value={inputCity}
        onChangeText={setInputCity}
      />

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={{ marginTop: 10 }}>Loading weather...</Text>
        </View>
      )}

      {!loading && !inputCity && (
        <View style={styles.center}>
          <Text style={{ fontSize: 18, color: "#5c2b33" }}>
            Write a city to look for
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={{ fontSize: 18, color: "red" }}>
            City not found. Try again
          </Text>
        </View>
      )}

      {!loading && forecast.length > 0 && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.currentContainer}>
            <Text style={styles.city}>{city}</Text>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${forecast[0].weather[0].icon}@2x.png`,
              }}
              style={styles.currentIcon}
            />
            <Text style={styles.currentTemp}>{forecast[0].main.temp}°C</Text>
            <Text style={styles.currentDesc}>
              {forecast[0].weather[0].description}
            </Text>
          </View>

          <FlatList
            data={forecast}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const itemIconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
              return (
                <Card style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.left}>
                      <Text style={styles.date}>
                        {new Date(item.dt * 1000).toLocaleDateString("en-GB", {
                          weekday: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Text>
                    </View>
                    <View style={styles.right}>
                      <Image source={{ uri: itemIconUrl }} style={styles.icon} />
                      <View style={styles.info}>
                        <Text style={styles.temp}>{item.main.temp}°C</Text>
                        <Text style={styles.desc}>
                          {item.weather[0].description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            }}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffe6f0", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffd1e0",
    marginBottom: 16,
    color: "#5c2b33",
  },
  city: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#5c2b33",
  },
  currentContainer: {
    alignItems: "center",
    backgroundColor: "#ffb6cb",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  currentIcon: { width: 120, height: 120 },
  currentTemp: { fontSize: 64, fontWeight: "bold", color: "#5c2b33" },
  currentDesc: { fontSize: 18, textTransform: "capitalize" },
  card: {
    padding: 12,
    marginVertical: 6,
    alignItems: "center",
    backgroundColor: "#ffb6cb",
    borderRadius: 12,
  },
  date: { fontWeight: "bold", marginBottom: 4, color: "#5c2b33" },
  icon: { width: 60, height: 60 },
  temp: { fontSize: 20, fontWeight: "bold", marginVertical: 4 },
  desc: { textTransform: "capitalize", color: "#5c2b33" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flex: 1 },
  right: { flexDirection: "row", alignItems: "center" },
  info: { marginLeft: 10 },
});

