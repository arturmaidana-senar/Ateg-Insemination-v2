import { Text, TextInput } from 'react-native';

export const disableFontScaling = () => {
  if (Text.defaultProps == null) {
    Text.defaultProps = {};
  }
  Text.defaultProps.maxFontSizeMultiplier = 1.0;

  if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
  }
  TextInput.defaultProps.maxFontSizeMultiplier = 1.0;
};
