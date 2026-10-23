import { View, TextInput, StyleSheet } from "react-native";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

export default function InputBox({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}: Props) {
  return (
    <View style={styles.clayCard}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clayCard: {
    width: '100%',
    height: 64,
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    boxShadow: [
      {
        offsetX: 8,
        offsetY: 12,
        blurRadius: 16,
        color: 'rgba(0, 0, 0, 0.2)',
      },
      {
        offsetX: 6,
        offsetY: 6,
        blurRadius: 10,
        color: 'rgba(255, 255, 255, 0.45)',
        inset: true,
      },
      {
        offsetX: -8,
        offsetY: -8,
        blurRadius: 12,
        color: 'rgba(0, 0, 0, 0.25)',
        inset: true,
      },
    ],
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    color: 'black',
    backgroundColor: 'transparent',
  },
});