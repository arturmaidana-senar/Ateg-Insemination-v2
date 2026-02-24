import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
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

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    years.push(i);
  }
  return years;
};

const MonthCarousel = ({
  displayMonthIndex,
  displayYear,
  onMonthChange,
  onYearChange,
  monthlyEventCounts = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const yearsList = generateYears();

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

  const handleYearSelect = year => {
    onYearChange(year);
    setModalVisible(false);
  };

  const getVisibleMonths = () => {
    const visibleMonths = [];

    // Itera pelos 5 meses visíveis (2 antes, atual, 2 depois)
    for (let i = -2; i <= 2; i++) {
      let targetYear = displayYear;
      let targetMonthIndex = displayMonthIndex + i;

      // Lógica para detectar virada de ano nos vizinhos
      if (targetMonthIndex < 0) {
        targetMonthIndex = 12 + targetMonthIndex; // Ex: -1 vira 11 (Dez)
        targetYear = displayYear - 1; // Ano anterior
      } else if (targetMonthIndex > 11) {
        targetMonthIndex = targetMonthIndex - 12; // Ex: 12 vira 0 (Jan)
        targetYear = displayYear + 1; // Ano seguinte
      }

      // Tenta acessar: monthlyEventCounts[2025][11]
      const yearCounts = monthlyEventCounts[targetYear];
      const count = yearCounts ? yearCounts[targetMonthIndex] || 0 : 0;

      visibleMonths.push({
        name: MONTH_NAMES[targetMonthIndex],
        events: count,
        monthIndex: targetMonthIndex,
      });
    }
    return visibleMonths;
  };

  return (
    <View style={styles.eventsSection}>
      <View style={styles.eventsHeader}>
        <TouchableOpacity
          style={styles.yearSelector}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.eventsTitle} maxFontSizeMultiplier={1.2}>
            Agenda {displayYear}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Ano</Text>
            <FlatList
              data={yearsList}
              keyExtractor={item => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearOption,
                    displayYear === item && styles.selectedYearOption,
                  ]}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text
                    style={[
                      styles.yearOptionText,
                      displayYear === item && styles.selectedYearOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(5),
  },
  dropdownIcon: {
    fontSize: ms(12),
    color: '#1a1a1a',
    marginLeft: ms(6),
    marginTop: ms(2),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: ms(10),
    padding: ms(20),
    maxHeight: '50%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    marginBottom: ms(15),
    textAlign: 'center',
    color: '#333',
  },
  yearOption: {
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  selectedYearOption: {
    backgroundColor: '#E8F5E9',
    borderRadius: ms(5),
  },
  yearOptionText: {
    fontSize: ms(16),
    color: '#555',
  },
  selectedYearOptionText: {
    color: '#286E46',
    fontWeight: 'bold',
  },
});

export default MonthCarousel;
