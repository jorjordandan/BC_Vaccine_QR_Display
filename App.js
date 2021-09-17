import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function App() {
  const [image, setImage] = useState(null);
  const debug = true;

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async() => {
    const retrievedImage = await AsyncStorage.getItem("VAXPASS");
    setImage(retrievedImage);
  })()}, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
    await AsyncStorage.setItem("VAXPASS", result.uri);
  };

  const contactDev = () => {
    Linking.openURL("mailto:jordan@jordandavis.ca?subject=Vaccine app")
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
      
      {!!image &&
        <> 
          <Button title="Re-select image" onPress={pickImage} />
          <Button title="Contact Developer" onPress={contactDev} />
        </>
      }

      {debug && !!image && <Button title="Clear image" onPress={() => setImage(null)}/>}

      {!!image && <Image source={{ uri: image }} style={{ width: "100%", height: "60%"}} resizeMode="contain" />}
      
      {!image && 
      <>
        <Text style={{fontSize: 25, fontWeight: "bold", textAlign: "center", lineHeight: 32}}>This is a simple app for BC residents to quickly display an image of your Vaccine Passport QR code from your photo library. </Text>
        <Text style={{fontSize: 18, textAlign: "center", lineHeight: 28, paddingTop: 15}}>It does not send any information to any servers or databases, it only shows the code from your library. The code is open source. Getting your passport QR code onto your phone can be done by following the BC Vaccine Passport instructions, and then saving the QR code to your images.</Text>
      </>}

      {!image && 
      <>
       <Button title="Pick an image from camera roll" onPress={pickImage} />
       <Button title="BC Vaccine Passport instructions" onPress={() => Linking.openURL("https://www2.gov.bc.ca/vaccinecard.html")} />
      </>}

    </View>
  );
}