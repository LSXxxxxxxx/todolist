import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Colors from '../themes/Colors';
import Fonts from '../themes/Fonts';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, loading }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});

export default Button;
