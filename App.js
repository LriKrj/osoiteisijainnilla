import {useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from'expo-location';


export default function App() {

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission")
        return;
      }

      let current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const location = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
        
      }
      setLocation(location)
      console.log(location)
    })();
  }, []);

  const showLocation = () => {
    const URL = `http://www.mapquestapi.com/geocoding/v1/address?key=FBdRiKKHrEdW5pa20tORCDewx4ZL5iI2&location=${address}, FINLAND`
    fetch(URL)
    .then(response => response.json())
    .then(data => {
      const location = {
        latitude: data.results[0].locations[0].latLng.lat,
        longitude: data.results[0].locations[0].latLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      }
      setLocation(location)
    })
    .catch(error => {
      Alert.alert("Error fetching coordinates");
    });
  };
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        region={location}
      >
        <Marker 
          coordinate={location}
          
        />
      </MapView>

      <TextInput 
        style={styles.texts}
        onChangeText={address => setAddress(address)}
        value={address}
      />
        
      <View style={styles.button}>
        <Button title="Search" onPress={showLocation}/>
      </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    width: 250,  
    borderWidth: 1,
    
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  button: {
    padding: 5
  }
});