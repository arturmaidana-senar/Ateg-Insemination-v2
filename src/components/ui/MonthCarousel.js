// src/components/MonthCarousel.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';

import { ArrowLeftIcon, ArrowRightIcon } from '../Icons/Icons';

const MONTH_NAMES = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
];

const MonthCarousel = ({
  displayMonthIndex,
  onMonthChange,
  monthlyEventCounts = {},
}) => {
  const handlePrevMonth = () => {
    const newIndex = (displayMonthIndex - 1 + 12) % 12;
    onMonthChange(newIndex);
  };

  const handleNextMonth = () => {
    const newIndex = (displayMonthIndex + 1) % 12;
    onMonthChange(newIndex);
  };

  const handleMonthPress = monthIndex => {
    onMonthChange(monthIndex);
  };

  const getVisibleMonths = () => {
    const visibleMonths = [];
    for (let i = -2; i <= 2; i++) {
      const monthIndex = (displayMonthIndex + i + 12) % 12;
      visibleMonths.push({
        name: MONTH_NAMES[monthIndex],
        events: monthlyEventCounts[monthIndex] || 0,
        monthIndex: monthIndex,
      });
    }
    return visibleMonths;
  };

  return (
    <View style={styles.eventsSection}>
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle} maxFontSizeMultiplier={1.2}>
          Agenda
        </Text>
        <View style={styles.arrowButtonsContainer}>
          <TouchableOpacity
            onPress={handlePrevMonth}
            style={styles.arrowButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeftIcon width={14} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextMonth}
            style={[styles.arrowButton, { marginLeft: 15 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowRightIcon width={14} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.monthsWrapper}>
        {getVisibleMonths().map((month, index) => {
          const isActive = index === 2;
          return (
            <TouchableOpacity
              key={`${month.name}-${index}`}
              onPress={() => handleMonthPress(month.monthIndex)}
              style={[styles.monthBox, isActive && styles.activeMonthBox]}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.monthText, isActive && styles.activeMonthText]}
                maxFontSizeMultiplier={1.1}
              >
                {month.name}
              </Text>
              <Text
                style={[
                  styles.eventCountText,
                  isActive && styles.activeEventCountText,
                ]}
                maxFontSizeMultiplier={1.1}
              >
                {month.events} Atend
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventsSection: {
    backgroundColor: 'transparent',
    paddingBottom: ms(10),
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(15),
    paddingHorizontal: ms(4),
  },
  arrowButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    padding: ms(5),
  },
  eventsTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  monthsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthBox: {
    width: ms(58),
    height: ms(65),
    borderRadius: ms(12),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: ms(2),
  },
  activeMonthBox: {
    backgroundColor: '#286E46',
    elevation: 4,
    shadowColor: '#286E46',
    shadowOpacity: 0.3,
    transform: [{ scale: 1.05 }],
  },
  monthText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(13),
    color: '#757575',
    marginBottom: vs(2),
  },
  activeMonthText: {
    fontFamily: 'Ubuntu-Bold',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  eventCountText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(10),
    color: '#9E9E9E',
  },
  activeEventCountText: {
    color: '#E8F5E9',
    opacity: 0.9,
  },
});

export default MonthCarousel;
