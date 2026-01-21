import React from 'react';
import { View, Text } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={{
        width: '95%',
        padding: 18,
        backgroundColor: '#2ecc71',
        borderRadius: 10,
      }}
    >
      {text1 && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
          {text1}
        </Text>
      )}

      {text2 && (
        <Text style={{ fontSize: 16, color: '#fff', marginTop: 6 }}>
          {text2}
        </Text>
      )}
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      style={{
        width: '95%',
        padding: 15,
        marginTop:20,
        backgroundColor: '#e74c3c',
        borderRadius: 15,
      }}
    >
      {text1 && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
          {text1}
        </Text>
      )}

      {text2 && (
        <Text style={{ fontSize: 16, color: '#fff', marginTop: 6 }}>
          {text2}
        </Text>
      )}
    </View>

    
  ),
  info: ({ text1, text2 }) => (
    <View
      style={{
        width: '95%',
        padding: 15,
        marginTop:20,
        backgroundColor: '#fd9d2fff',
        borderRadius: 15,
      }}
    >
      {text1 && (
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
          {text1}
        </Text>
      )}

      {text2 && (
        <Text style={{ fontSize: 16, color: '#fff', marginTop: 6 }}>
          {text2}
        </Text>
      )}
    </View>

    
  ),
};
