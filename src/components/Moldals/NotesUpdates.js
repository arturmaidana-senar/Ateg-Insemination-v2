import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { CheckBadgeIcon } from '../Icons/Icons'; // Ícone mais adequado para "Release Notes"

const CloseIcon = () => (
  <Text style={{ fontSize: ms(24), color: '#333', fontWeight: '300' }}>×</Text>
);

export default function NotesUpdates({ isVisible, onClose }) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.5}
      animationInTiming={300}
      animationOutTiming={300}
      backdropTransitionOutTiming={1}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <CheckBadgeIcon width={ms(22)} height={ms(22)} color="#212121" />
            <Text style={styles.headerTitle} maxFontSizeMultiplier={1.0}>
              Notas de Atualização
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: ms(20) }}
        >
          <Text style={styles.title} maxFontSizeMultiplier={1.0}>
            🆕 Ateg Inseminação – Versão 1.0.0
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.0}>
            Janeiro de 2026
          </Text>

          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O aplicativo Ateg Inseminação foi desenvolvido pelo SENAR-MT para
            otimizar a rotina dos técnicos de campo, permitindo o registro ágil
            e seguro dos atendimentos de Inseminação Artificial em Tempo Fixo
            (IATF).
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Esta versão foca na estabilidade do funcionamento offline e na
            garantia da integridade dos dados coletados nas propriedades rurais.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            🚀 Funcionalidades Principais
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • <Text style={styles.bold}>Modo Offline Robusto:</Text> Realize
            atendimentos mesmo sem internet. Os dados são sincronizados
            automaticamente quando a conexão é restabelecida;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • <Text style={styles.bold}>Gestão de Protocolos:</Text>{' '}
            Acompanhamento completo das etapas D0, D8 e D10;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • <Text style={styles.bold}>Evidências Fotográficas:</Text> Captura
            e armazenamento de fotos (mínimo 3, máximo 5) para validação do
            serviço;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • <Text style={styles.bold}>Geolocalização:</Text> Registro
            automático das coordenadas GPS do local do atendimento;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • <Text style={styles.bold}>Agenda Inteligente:</Text> Visualização
            clara dos atendimentos "Em Progresso", "Realizados" e "Aguardando".
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            🔒 Segurança e Dados
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            • Criptografia local para proteção dos dados dos produtores e dos
            atendimentos.
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            • Autenticação segura integrada aos sistemas do SENAR-MT.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            🛠️ Correções e Melhorias
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Otimização no upload de imagens para consumir menos dados móveis;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Melhoria na performance da lista de agendamentos;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Ajustes visuais para facilitar a leitura em ambientes com muita
            luz solar.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            📞 Suporte Técnico
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Encontrou algum erro ou tem sugestões? Entre em contato com o
            suporte de TI:
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            📧 E-mail: atendimento@senarmt.org.br
          </Text>

          <Text
            style={[
              styles.paragraph,
              {
                marginTop: ms(20),
                textAlign: 'center',
                fontSize: ms(11),
                color: '#999',
              },
            ]}
            maxFontSizeMultiplier={1.0}
          >
            © 2026 SENAR Mato Grosso
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = ScaledSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20@ms',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '16@ms',
    padding: '20@ms',
    width: '100%',
    maxHeight: '85%', // Limita a altura para não estourar a tela
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12@ms',
    marginBottom: '12@ms',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: '16@ms',
    color: '#212121',
    marginLeft: '10@ms',
  },
  title: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: '15@ms',
    color: '#008346', // Verde Senar
    marginBottom: '4@ms',
  },
  subtitle: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: '12@ms',
    color: '#757575',
    marginBottom: '16@ms',
  },
  sectionTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: '14@ms',
    color: '#333',
    marginTop: '16@ms',
    marginBottom: '8@ms',
  },
  paragraph: {
    fontFamily: 'Ubuntu-Light',
    fontSize: '13@ms',
    color: '#424242',
    lineHeight: '20@ms',
    marginBottom: '8@ms',
  },
  bullet: {
    fontFamily: 'Ubuntu-Light',
    fontSize: '13@ms',
    color: '#424242',
    lineHeight: '20@ms',
    marginBottom: '6@ms',
    marginLeft: '8@ms',
  },
  bold: {
    fontFamily: 'Ubuntu-Medium',
    fontWeight: '600',
  },
});
