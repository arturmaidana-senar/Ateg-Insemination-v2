import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  CustomSelect,
  CustomSelectUser,
} from '../../../components/ui/CustomSelect.js';
import CardCheckout from '../../../components/ui/CardCheckout.js';
import { dataAtual } from '../../../utils/date.js';
import {
  Checkbox,
  CheckboxFilled,
  CheckIcon,
  CircleAlert,
} from '../../../components/Icons/Icons.js';
import { ScaledSheet, ms, vs } from 'react-native-size-matters';

const WarningBox = ({ text }) => (
  <View style={styles.warningBox}>
    <CircleAlert
      name="info-outline"
      size={24}
      color="#FFA500"
      style={styles.warningIcon}
    />
    <Text style={styles.warningText} maxFontSizeMultiplier={1.0}>
      {text}
    </Text>
  </View>
);

export default function InformationTab({
  schedule,
  inseminacaoVisit,
  inseminacaoVisitExist,
  technicianUsers,
  technicianName,
  setTechnicianName,
  handleStartService,
  isHaveAttendence,
  setIsHaveAttendence,
  justifications,
  motivo,
  setMotivo,
  motivoId,
  setMotivoId,
  messageText,
  setMessageText,
  handleEndService,
  isConnected,
  sendService,
}) {
  return (
    <ScrollView>
      <View style={styles.formTabContainer}>
        {schedule &&
          schedule.date == dataAtual() &&
          !inseminacaoVisit.id &&
          inseminacaoVisitExist == false && (
            <>
              <WarningBox text="Antes de iniciar a análise, certifique-se de que não há nenhum atendimento em aberto." />

              <Text style={styles.selectLabel} maxFontSizeMultiplier={1.0}>
                Selecione o Técnico de Campo
              </Text>
              <View style={styles.pickerContainer}>
                <CustomSelectUser
                  options={technicianUsers}
                  selectedValue={technicianName}
                  onSelect={name => setTechnicianName(name)}
                  placeholder="Selecione o Técnico do atendimento"
                />
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleStartService}
                activeOpacity={0.8}
              >
                <CheckIcon name="play-arrow" size={22} color="#FFFFFF" />
                <Text
                  style={styles.actionButtonText}
                  maxFontSizeMultiplier={1.0}
                >
                  Iniciar Atendimento
                </Text>
              </TouchableOpacity>
            </>
          )}

        {inseminacaoVisit.pending == 1 && (
          <CardCheckout
            title="Atendimento Realizado"
            dateStart={inseminacaoVisit.checkin}
            dateEnd={inseminacaoVisit.checkout}
          />
        )}

        {inseminacaoVisitExist && !inseminacaoVisit.id && (
          <WarningBox text="Há um atendimento em andamento. Finalize-o antes de abrir outro." />
        )}

        {schedule &&
          schedule.date != dataAtual() &&
          !inseminacaoVisit.id &&
          inseminacaoVisitExist == false && (
            <WarningBox text="Não está na data de agendamento!" />
          )}

        {inseminacaoVisit &&
          inseminacaoVisit.id &&
          !inseminacaoVisit.checkout && (
            <>
              <View style={styles.checkboxRow}>
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setIsHaveAttendence(!isHaveAttendence)}
                >
                  {isHaveAttendence ? (
                    <Checkbox color="#008346" />
                  ) : (
                    <CheckboxFilled color="#888888" />
                  )}

                  <Text
                    style={styles.checkboxLabel}
                    maxFontSizeMultiplier={1.0}
                  >
                    Marque esta opção se o atendimento não foi realizado
                    conforme o previsto.
                  </Text>
                </Pressable>
              </View>

              {isHaveAttendence && (
                <>
                  <Text
                    style={[styles.selectLabel, { width: '90%' }]}
                    maxFontSizeMultiplier={1.0}
                  >
                    Selecione o Motivo
                  </Text>
                  <View style={styles.pickerContainer}>
                    <CustomSelect
                      options={justifications}
                      selectedValue={motivo}
                      placeholder="Selecione o motivo"
                      onSelect={(id, name) => {
                        setMotivoId(id);
                        setMotivo(name);
                      }}
                    />
                  </View>
                  {motivoId == 4 && (
                    <>
                      <Text
                        style={styles.inputLabel}
                        maxFontSizeMultiplier={1.0}
                      >
                        Observação
                      </Text>
                      <TextInput
                        style={styles.textArea}
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline={true}
                        numberOfLines={4}
                        editable={isHaveAttendence}
                        placeholder="Descreva o motivo..."
                        maxFontSizeMultiplier={1.0}
                      />
                    </>
                  )}
                </>
              )}

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
                onPress={handleEndService}
                activeOpacity={0.8}
              >
                <Text
                  style={styles.actionButtonText}
                  maxFontSizeMultiplier={1.0}
                >
                  Finalizar Atendimento
                </Text>
              </TouchableOpacity>
            </>
          )}

        {inseminacaoVisit &&
          isConnected &&
          inseminacaoVisit.pending == 1 &&
          inseminacaoVisit.sent == 0 && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { marginTop: 15, backgroundColor: '#007BFF' },
              ]}
              onPress={sendService}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText} maxFontSizeMultiplier={1.0}>
                Enviar Atendimento
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE5B3',
    borderRadius: ms(8),
    padding: ms(6),
    marginBottom: ms(14),
    width: '100%',
  },
  warningIcon: {
    marginRight: ms(15),
  },
  warningText: {
    flex: 1,
    fontSize: ms(13),
    color: '#665A3E',
    lineHeight: ms(20),
    paddingLeft: ms(10),
  },
  selectLabel: {
    fontSize: ms(15),
    color: '#333333',
    fontWeight: '500',
    marginBottom: ms(8),
    width: '90%',
    textAlign: 'left',
  },

  formTabContainer: {
    alignItems: 'center',
    paddingVertical: ms(1),
    paddingHorizontal: ms(5),
    backgroundColor: '#F6F9F7',
    width: '100%',
  },
  formImage: {
    width: ms(200),
    height: ms(200),
    resizeMode: 'contain',
    marginBottom: ms(10),
  },
  formTitle: {
    fontFamily: 'Ubuntu-Light',
    fontSize: ms(14),
    color: '#333',
    textAlign: 'center',
    marginBottom: ms(15),
    maxWidth: '90%',
    lineHeight: ms(20),
  },
  pickerContainer: {
    width: '100%',
    borderRadius: ms(8),
    marginBottom: ms(24),
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#008346',
    paddingVertical: ms(10),
    borderRadius: ms(9),
    width: '70%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    marginVertical: ms(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(16),
    fontWeight: '600',
    textAlign: 'center',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginRight: ms(25),
  },
  checkboxLabel: {
    fontSize: ms(13),
    padding: ms(10),
    color: '#333',
    marginLeft: ms(2),
  },
  inputLabel: {
    fontSize: ms(14),
    color: '#333',
    marginBottom: ms(8),
    width: '90%',
    textAlign: 'left',
    fontFamily: 'Ubuntu-Regular',
  },
  textArea: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: ms(8),
    marginBottom: ms(20),
    backgroundColor: '#FAFAFA',
    padding: ms(12),
    height: ms(100),
    textAlignVertical: 'top',
    fontFamily: 'Ubuntu-Light',
  },
});
