import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaledSheet, ms } from 'react-native-size-matters';

export function ButtonContainer({ buttons, onClick, active }) {
  return (
    <View style={styles.container}>
      {buttons.map((btn, i) => {
        const isActive = active === i;
        const IconComponent = btn.icon;

        return (
          <TouchableOpacity
            key={btn.label}
            style={[styles.btn, isActive && styles.activeBtn]}
            onPress={() => onClick(i)}
            activeOpacity={0.7}
          >
            <IconComponent
              color={isActive ? '#333333' : '#666666'}
              width={ms(18)}
              height={ms(18)}
            />

            <Text
              style={[styles.btnText, isActive && styles.activeBtnText]}
              maxFontSizeMultiplier={1.0}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1EEE7',
    padding: '4@ms',
    height: '50@ms',
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10@ms',
    height: '100%',
  },
  activeBtn: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  btnText: {
    fontSize: '12@ms',
    fontWeight: '500',
    marginLeft: '6@ms',
    color: '#666666',
  },
  activeBtnText: {
    color: '#333333',
    fontWeight: '600',
  },
});
