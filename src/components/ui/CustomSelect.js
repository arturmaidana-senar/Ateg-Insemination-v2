import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { ArrowDownIcon } from '../Icons/Icons';

const BottomSheetSelect = ({
  visible,
  onClose,
  options,
  onSelect,
  title,
  selectedValue,
  searchPlaceholder = 'Buscar...',
}) => {
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    return options.filter(item => {
      const label = item.name || item.label || '';
      return label.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [options, searchText]);

  const handleSelect = item => {
    onSelect(item);
    setSearchText('');
    onClose();
  };

  const renderItem = ({ item }) => {
    const label = item.name || item.label;
    const isSelected = selectedValue === label;

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {label}
        </Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Text style={{ color: '#008346', fontWeight: 'bold' }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        style={styles.absolute}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="black"
      />

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContentWrapper}
      >
        <View
          style={[
            styles.modalContainer,
            {
              paddingBottom: Platform.OS === 'android' ? ms(20) : insets.bottom,
            },
          ]}
        >
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filteredOptions}
            keyExtractor={item =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma opção encontrada.</Text>
              </View>
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const CustomSelect = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.selectTrigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.selectText, !selectedValue && styles.placeholderText]}
        >
          {selectedValue || placeholder}
        </Text>
        <ArrowDownIcon width={ms(14)} color="#666" />
      </TouchableOpacity>

      <BottomSheetSelect
        visible={visible}
        onClose={() => setVisible(false)}
        options={options}
        title="Selecione o Motivo"
        selectedValue={selectedValue}
        searchPlaceholder="Buscar motivo..."
        onSelect={item => onSelect(item.id, item.name)}
      />
    </>
  );
};

export const CustomSelectUser = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.selectTrigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.selectText, !selectedValue && styles.placeholderText]}
        >
          {selectedValue || placeholder}
        </Text>
        <ArrowDownIcon width={ms(14)} color="#666" />
      </TouchableOpacity>

      <BottomSheetSelect
        visible={visible}
        onClose={() => setVisible(false)}
        options={options}
        title="Selecione o Técnico"
        selectedValue={selectedValue}
        searchPlaceholder="Buscar técnico..."
        onSelect={item => onSelect(item.name)}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  selectTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: '12@ms',
    paddingHorizontal: '16@ms',
    paddingVertical: '14@ms',
    marginBottom: '8@ms',
  },
  selectText: {
    fontSize: '14@ms',
    color: '#333333',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContentWrapper: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '24@ms',
    borderTopRightRadius: '24@ms',
    paddingTop: '12@ms',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: '40@ms',
    height: '4@ms',
    backgroundColor: '#E0E0E0',
    borderRadius: '2@ms',
    alignSelf: 'center',
    marginBottom: '16@ms',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '20@ms',
    marginBottom: '16@ms',
  },
  modalTitle: {
    fontSize: '18@ms',
    fontWeight: 'bold',
    color: '#212121',
  },
  closeBtn: {
    padding: '4@ms',
  },
  closeBtnText: {
    color: '#008346',
    fontSize: '14@ms',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: '20@ms',
    marginBottom: '10@ms',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: '10@ms',
    paddingHorizontal: '12@ms',
    paddingVertical: '10@ms',
    fontSize: '14@ms',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: '20@ms',
    paddingBottom: '10@ms',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '16@ms',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionItemSelected: {
    backgroundColor: '#F0F9F4',
    marginHorizontal: '-20@ms',
    paddingHorizontal: '20@ms',
  },
  optionText: {
    fontSize: '16@ms',
    color: '#424242',
  },
  optionTextSelected: {
    color: '#008346',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: '10@ms',
  },
  emptyContainer: {
    padding: '20@ms',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: '14@ms',
  },
});
