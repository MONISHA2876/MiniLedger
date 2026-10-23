import { View, Text, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import InputBox from '@/components/InputBox';
import Button_full_len from '@/components/Button_full_len';
import BackTract_btn from '@/components/BackTract_btn';

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState<{ username?: string; mobile?: string }>({});

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (errors.username) setErrors((e) => ({ ...e, username: undefined }));
  };

  const handleMobileChange = (text: string) => {

    const digits = text.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digits);
    if (errors.mobile) setErrors((e) => ({ ...e, mobile: undefined }));
  };

  const handleContinue = () => {
    const newErrors: { username?: string; mobile?: string } = {};
    const name = username.trim();

    if (name.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      newErrors.username = 'Use only letters, numbers and underscores';
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }

    router.navigate({
      pathname: '/verify-otp',
      params: { username: name, mobile: mobileNumber },
    });
  };

  return (
    <View style={styles.container}>
      <BackTract_btn />
      <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold' }}>Getting Started</Text>
      <Text style={{ color: '#6f6f6f', fontSize: 18, paddingTop: 8 }}>
        Enter a username and mobile number to continue (^v^)
      </Text>

      <Image
        source={require('@/assets/images/wink_guy.png')}
        style={{ width: '80%', height: '35%', margin: 24, marginHorizontal: 'auto' }}
        resizeMode="contain"
      />

      <InputBox placeholder="Username" value={username} onChangeText={handleUsernameChange} />
      {errors.username && <Text style={styles.error}>⚠ {errors.username}</Text>}

      <InputBox
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={handleMobileChange}
      />
      {errors.mobile && <Text style={styles.error}>⚠ {errors.mobile}</Text>}

      <Button_full_len
        text="Continue →"
        bgColor="#9482db"
        color="white"
        width="100%"
        onPress={handleContinue}
      />

      <Text style={{ color: '#6f6f6f', fontSize: 16, paddingTop: 16, textAlign: 'center', marginHorizontal: 'auto' }}>
        Already have an account?{' '}
        <Text style={{ color: '#9482db', fontSize: 16 }} onPress={() => router.navigate('/login')}>
          Log in
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