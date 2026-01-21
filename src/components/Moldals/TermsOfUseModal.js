import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { ScaledSheet, ms, vs } from 'react-native-size-matters';

import { ShieldCheckIcon } from '../Icons/Icons';

const CloseIcon = () => (
  <Text
    style={{ fontSize: 24, color: '#333', fontWeight: '300' }}
    maxFontSizeMultiplier={1.0}
  >
    ×
  </Text>
);

export default function TermsOfUseModal({ isVisible, onClose }) {
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
            <ShieldCheckIcon width={22} height={22} />
            <Text style={styles.headerTitle} maxFontSizeMultiplier={1.0}>
              Termos de Uso
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.title} maxFontSizeMultiplier={1.0}>
            Termos de Uso – Aplicativo Ateg Inseminação
          </Text>
          <Text style={styles.subtitle} maxFontSizeMultiplier={1.0}>
            Última atualização: outubro de 2025
          </Text>

          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Bem-vindo ao Ateg Inseminação, aplicativo oficial voltado para o
            gerenciamento de serviços de inseminação animal.
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Ao utilizar o aplicativo, você concorda com os presentes Termos de
            Uso, que têm como objetivo informar as condições de utilização e as
            responsabilidades envolvidas no acesso e uso dos serviços
            oferecidos.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            1. Sobre o aplicativo
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O Ateg Inseminação é uma plataforma criada para facilitar o controle
            e acompanhamento de processos de inseminação, permitindo o registro
            de animais, agendamentos de procedimentos, histórico de
            inseminações, e outros serviços relacionados à gestão reprodutiva.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            2. Aceitação dos Termos
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Ao acessar ou utilizar o aplicativo, o usuário declara ter lido,
            compreendido e concordado integralmente com estes Termos de Uso.
            Caso não concorde com qualquer parte, o usuário deve interromper o
            uso do aplicativo.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            3. Cadastro e Dados Pessoais
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Para utilizar os serviços do aplicativo, poderá ser solicitado o
            fornecimento de dados pessoais e informações sobre os animais, como:
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Nome completo do responsável
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • CPF/CNPJ
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Contato (telefone, e-mail)
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Informações sobre os animais (nome, espécie, idade, registro)
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Esses dados são coletados exclusivamente para fins de identificação,
            controle e registro das atividades do Ateg Inseminação, respeitando
            a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O Ateg Inseminação compromete-se a não compartilhar, vender ou
            divulgar os dados pessoais dos usuários a terceiros sem autorização,
            exceto quando exigido por lei.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            4. Responsabilidades do Usuário
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O usuário se compromete a:
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Fornecer informações verdadeiras, completas e atualizadas durante
            o cadastro;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Utilizar o aplicativo apenas para os fins propostos e de forma
            ética;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Não tentar acessar informações, áreas restritas ou sistemas de
            terceiros sem autorização;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Não praticar atos que possam comprometer o funcionamento, a
            segurança ou a integridade do aplicativo.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            5. Responsabilidades do Ateg Inseminação
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O Ateg Inseminação:
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Pode atualizar ou modificar o aplicativo a qualquer momento, com o
            objetivo de melhorar a experiência e os serviços oferecidos;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Não se responsabiliza por indisponibilidades temporárias, falhas
            de conexão ou uso indevido do aplicativo por terceiros;
          </Text>
          <Text style={styles.bullet} maxFontSizeMultiplier={1.0}>
            • Garante a proteção dos dados pessoais armazenados, adotando
            medidas de segurança adequadas para evitar acessos não autorizados.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            6. Direitos de Propriedade Intelectual
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Todo o conteúdo disponível no aplicativo, incluindo textos, imagens,
            logotipos, ícones, layout e informações, é de propriedade do Ateg
            Inseminação e protegido por leis de direitos autorais e propriedade
            intelectual.
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            É proibida qualquer reprodução, modificação ou distribuição sem
            autorização prévia e expressa do Ateg Inseminação.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            7. Alterações dos Termos de Uso
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O Ateg Inseminação poderá alterar estes Termos de Uso a qualquer
            momento. As alterações entrarão em vigor assim que publicadas no
            aplicativo.
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            O uso contínuo do aplicativo após as alterações será considerado
            como aceitação das novas condições.
          </Text>

          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.0}>
            8. Contato
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            Em caso de dúvidas, solicitações ou reclamações relacionadas ao uso
            do aplicativo ou ao tratamento de dados pessoais, entre em contato
            com o Ateg Inseminação por meio dos canais oficiais:
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            📧 E-mail: [inserir e-mail de contato]
          </Text>
          <Text style={styles.paragraph} maxFontSizeMultiplier={1.0}>
            🌐 Site: [inserir site do Ateg Inseminação]
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: ms(16),
    padding: ms(20),
    width: '100%',
    maxWidth: ms(400),
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: ms(12),
    marginBottom: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(15),
    color: '#212121',
    marginLeft: ms(10),
  },
  scrollView: {},
  title: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: ms(14),
    color: '#212121',
    marginBottom: ms(4),
  },
  subtitle: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(12),
    color: '#757575',
    marginBottom: ms(16),
  },
  sectionTitle: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: ms(14),
    color: '#333',
    marginTop: ms(16),
    marginBottom: ms(8),
  },
  paragraph: {
    fontFamily: 'Ubuntu-Light',
    fontSize: ms(13),
    color: '#000000ff',
    lineHeight: ms(22),
    marginBottom: ms(12),
  },
  bullet: {
    fontFamily: 'Ubuntu-Light',
    fontSize: ms(14),
    color: '#000000ff',
    lineHeight: ms(22),
    marginBottom: ms(6),
    marginLeft: ms(10),
  },
});
