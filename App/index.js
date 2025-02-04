// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API_URL = "http://apihub.p.appply.xyz:3300/chatgpt";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [reason, setReason] = useState('');
  const [assetType, setAssetType] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>MUNDUM CLUB Investment Valuation</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AssetPicker', { assetType, setAssetType })}>
          <Text style={styles.buttonText}>{assetType || 'Select Asset Type'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Reason for Investment"
          value={reason}
          onChangeText={setReason}
          placeholderTextColor="#5d4954"
        />
        <EvaluateButton reason={reason} assetType={assetType} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AssetPickerScreen({ route, navigation }) {
  const { setAssetType } = route.params;
  const [selectedAsset, setSelectedAsset] = useState(route.params.assetType);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Select Asset Type</Text>
        <Picker
          selectedValue={selectedAsset}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedAsset(itemValue)}>
          <Picker.Item label="Select Asset Type" value="" />
          <Picker.Item label="Bitcoin" value="Bitcoin" />
          <Picker.Item label="ICO Tokens" value="ICO Tokens" />
          <Picker.Item label="Invest Startup" value="Invest Startup" />
          <Picker.Item label="Real Estate" value="Real Estate" />
          <Picker.Item label="Stocks" value="Stocks" />
          <Picker.Item label="Bonds" value="Bonds" />
          <Picker.Item label="Commodities" value="Commodities" />
          <Picker.Item label="Mutual Funds" value="Mutual Funds" />
          <Picker.Item label="ETFs" value="ETFs" />
          <Picker.Item label="Precious Metals" value="Precious Metals" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={() => {
          setAssetType(selectedAsset);
          navigation.goBack();
        }}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function EvaluateButton({ reason, assetType }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    setLoading(true);
    setResponse('');
    try {
      const apiResponse = await axios.post(API_URL, {
        messages: [
          { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
          { role: "user", content: `I want to invest in ${assetType} because ${reason}. Please provide a brief comment on this decision.` }
        ],
        model: "gpt-4o"
      });

      const { data } = apiResponse;
      setResponse(data.response);
    } catch (error) {
      console.error(error);
      setResponse('There was an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={[styles.button, styles.yellowButton]} onPress={handleEvaluate}>
        <Text style={styles.buttonText}>Evaluate</Text>
      </TouchableOpacity>
      {loading ? <ActivityIndicator size="large" color="#136f63" /> : null}
      {response ? <Text style={styles.response}>{response}</Text> : null}
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Investment Valuation' }} />
        <Stack.Screen name="AssetPicker" component={AssetPickerScreen} options={{ title: 'Select Asset' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ecc30b',
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    color: '#ecc30b',
    backgroundColor: 'rgba(93, 73, 84, 0.4)',  // Adjust the background color for better visibility
  },
  input: {
    height: 50,
    borderColor: '#5d4954',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    color: '#ecc30b',
  },
  button: {
    backgroundColor: '#de1a1a',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  yellowButton: {
    backgroundColor: '#ecc30b', // Yellow color for the buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: '#136f63',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});