import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import InputBox from '@/components/InputBox';
import Button_full_len from '@/components/Button_full_len';
import BackTract_btn from '@/components/BackTract_btn';

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    return (
        <View style={styles.container}>
            <BackTract_btn />
            <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>Getting Started</Text>
            <Text style={{ color: '#6f6f6f', fontSize: 18, paddingTop: 8 }}>
                Enter a username and mobile number to continue (^v^)
            </Text>

            <Image source={require('@/assets/images/wink_guy.png')} style={{ width: '80%', height: '35%', margin: 24, marginHorizontal: 'auto' }} />

            <InputBox placeholder="Username" value={username} onChangeText={setUsername} />
            <InputBox placeholder="Mobile Number" keyboardType="phone-pad" value={mobileNumber} onChangeText={setMobileNumber} />

            <Button_full_len text="Continue →" bgColor="#9482db" color="white" width="100%" route='/verify-otp' />

            <Text style={{ color: '#6f6f6f', fontSize: 16, paddingTop: 16, textAlign: 'center', marginHorizontal: 'auto' }}>
                Already have an account? <Text style={{ color: '#9482db', fontSize: 16 }} onPress={() => router.navigate('/login')}>Log in</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 48,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
 });