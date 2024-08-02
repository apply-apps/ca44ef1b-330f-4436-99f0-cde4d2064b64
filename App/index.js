// Filename: index.js
// Combined code from all files
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Button, Text, ActivityIndicator, View } from 'react-native';
import axios from 'axios';

const API_URL = "http://apihub.p.appply.xyz:3300/chatgpt";

export default function App() {
    const [assetType, setAssetType] = useState('');
    const [reason, setReason] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEvaluate = async () => {
        setLoading(true);
        setResponse('');
        try {
            const apiResponse = await axios.post(API_URL, {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
                    { role: "user", content: `I want to invest in ${assetType} because ${reason}. Please comment on this decision.` }
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>MUNDUM CLUB Investment Valuation</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type of Asset"
                    value={assetType}
                    onChangeText={setAssetType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Reason for Investment"
                    value={reason}
                    onChangeText={setReason}
                />
                <Button title="Evaluate" onPress={handleEvaluate} color="#ecc30b" />
                {loading ? <ActivityIndicator size="large" color="#136f63" /> : null}
                {response ? <Text style={styles.response}>{response}</Text> : null}
            </ScrollView>
        </SafeAreaView>
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
    response: {
        marginTop: 20,
        fontSize: 16,
        color: '#136f63',
        paddingHorizontal: 10,
        textAlign: 'center',
    },
});