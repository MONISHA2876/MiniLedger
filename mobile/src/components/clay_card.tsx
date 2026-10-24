import {StyleSheet} from 'react-native';

export const styles_ext = StyleSheet.create({
    clayCard: {
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
  clayCardLight: {
    boxShadow: [
      {
        offsetX: 8,
        offsetY: 12,
        blurRadius: 16,
        color: 'rgba(0, 0, 0, 0.1)',
      },
      {
        offsetX: 6,
        offsetY: 6,
        blurRadius: 10,
        color: 'rgba(255, 255, 255, 0.2)',
        inset: true,
      },
      {
        offsetX: -8,
        offsetY: -8,
        blurRadius: 12,
        color: 'rgba(0, 0, 0, 0.1)',
        inset: true,
      },
    ],
  },
});