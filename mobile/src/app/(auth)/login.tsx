import { View, Text, StyleSheet, Image } from 'react-native';
import BackTract_btn from '@/components/BackTract_btn';
import InputBox from '@/components/InputBox';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Button_full_len from '@/components/Button_full_len';

export default function Login() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  const handleChange = (text: string) => {

    const digits = text.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digits);
    if (error) setError('');
  };

  const handleContinue = () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return; // stay on the page
    }

    router.navigate({
      pathname: '/verify-otp',
      params: { mobile: mobileNumber },
    });
  };

  return (
    <View style={styles.container}>
      <BackTract_btn />
      <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>Log in</Text>
      <Text style={{ color: '#6f6f6f', fontSize: 18, paddingTop: 8 }}>
        Enter your mobile number to continue (╹◡╹)
      </Text>

      <Image
        source={require('@/assets/images/cute_guy.png')}
        style={{ width: '80%', height: '35%', margin: 24, marginHorizontal: 'auto' }}
        resizeMode="contain"
      />

      <InputBox
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={handleChange}
      />

      {error !== '' && <Text style={styles.error}>⚠ {error}</Text>}

      <Button_full_len
        text="Continue →"
        bgColor="#9482db"
        color="white"
        width="100%"
        onPress={handleContinue}
      />

      <Text style={{ color: '#6f6f6f', fontSize: 16, paddingTop: 16, textAlign: 'center', marginHorizontal: 'auto' }}>
        Didn't have an account? (╥﹏╥)
      </Text>
      <Text style={{ color: '#6f6f6f', fontSize: 16, paddingTop: 2, textAlign: 'center', marginHorizontal: 'auto' }}>
        Try making one.{' '}
        <Text style={{ color: '#9482db', fontSize: 16 }} onPress={() => router.navigate('/signup')}>
          Sign Up
        </Text>
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
  error: {
    color: '#e5484d',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 8,
  },
});