import styles from "./page.module.css";

export const metadata = {
  title: "Política de Privacidade | Bicho Capiba",
  description:
    "Política de privacidade da plataforma Bicho Capiba - Como coletamos, usamos e protegemos seus dados pessoais",
};

export default function PrivacidadePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Política de Privacidade</h1>
          <p className={styles.date}>
            Última atualização: 11 de novembro de 2025
          </p>
        </header>

        <section className={styles.section}>
          <h2>1. Introdução</h2>
          <p>
            Bem-vindo à Política de Privacidade do Bicho Capiba. Esta política
            descreve como coletamos, usamos, armazenamos e protegemos suas
            informações pessoais quando você utiliza nossa plataforma que
            conecta ONGs e abrigos de animais com futuros tutores.
          </p>
          <p>
            Ao utilizar o Bicho Capiba, você concorda com as práticas descritas
            nesta Política de Privacidade.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Informações que Coletamos</h2>

          <h3>2.1. Informações Fornecidas por Você</h3>
          <ul>
            <li>
              <strong>Dados de Cadastro:</strong> Nome completo, e-mail, senha,
              telefone e endereço
            </li>
            <li>
              <strong>Informações de Perfil:</strong> Foto de perfil,
              preferências de adoção, histórico de interações
            </li>
            <li>
              <strong>Informações de ONGs/Abrigos:</strong> Razão social, CNPJ,
              endereço, dados bancários para doações, informações sobre animais
              disponíveis
            </li>
            <li>
              <strong>Comunicações:</strong> Mensagens enviadas através da
              plataforma, formulários de contato e solicitações de adoção
            </li>
          </ul>

          <h3>2.2. Informações Coletadas Automaticamente</h3>
          <ul>
            <li>
              <strong>Dados de Navegação:</strong> Endereço IP, tipo de
              navegador, páginas visitadas, tempo de permanência
            </li>
            <li>
              <strong>Cookies:</strong> Utilizamos cookies para melhorar sua
              experiência e manter sua sessão ativa
            </li>
            <li>
              <strong>Dados de Uso:</strong> Interações com a plataforma, buscas
              realizadas, animais visualizados
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Como Utilizamos suas Informações</h2>
          <p>Utilizamos suas informações pessoais para:</p>
          <ul>
            <li>Criar e gerenciar sua conta na plataforma</li>
            <li>
              Facilitar a comunicação entre futuros tutores e ONGs/abrigos
            </li>
            <li>Processar solicitações de adoção e doações</li>
            <li>
              Enviar notificações sobre animais que correspondem ao seu perfil
            </li>
            <li>Melhorar e personalizar sua experiência na plataforma</li>
            <li>Garantir a segurança e prevenir fraudes</li>
            <li>
              Cumprir obrigações legais e regulatórias, incluindo a Lei Geral de
              Proteção de Dados (LGPD)
            </li>
            <li>
              Enviar comunicações sobre atualizações da plataforma e campanhas
              de adoção (quando autorizado)
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Suas informações podem ser compartilhadas nas seguintes situações:
          </p>

          <h3>4.1. Com ONGs e Abrigos</h3>
          <p>
            Quando você manifesta interesse em adotar um animal, compartilhamos
            suas informações de contato com a ONG ou abrigo responsável pelo
            animal.
          </p>

          <h3>4.2. Com Futuros Tutores</h3>
          <p>
            ONGs e abrigos podem visualizar informações básicas do perfil de
            usuários interessados em adoção.
          </p>

          <h3>4.3. Processadores de Pagamento</h3>
          <p>
            Para processar doações, compartilhamos informações necessárias com
            processadores de pagamento parceiros.
          </p>

          <h3>4.4. Fornecedores de Serviços</h3>
          <p>
            Podemos compartilhar dados com prestadores de serviços que nos
            auxiliam na operação da plataforma (hospedagem, análise de dados,
            suporte ao cliente).
          </p>

          <h3>4.5. Exigências Legais</h3>
          <p>
            Podemos divulgar informações quando exigido por lei ou para proteger
            nossos direitos e a segurança dos usuários.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Segurança dos Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para
            proteger suas informações pessoais contra acesso não autorizado,
            alteração, divulgação ou destruição. Isso inclui:
          </p>
          <ul>
            <li>Criptografia de dados sensíveis em trânsito e em repouso</li>
            <li>Controles de acesso rigorosos</li>
            <li>Monitoramento contínuo de atividades suspeitas</li>
            <li>Treinamento regular da equipe sobre práticas de segurança</li>
            <li>Auditorias periódicas de segurança</li>
          </ul>
          <p>
            No entanto, nenhum método de transmissão pela internet ou
            armazenamento eletrônico é 100% seguro. Embora nos esforcemos para
            proteger suas informações, não podemos garantir segurança absoluta.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Seus Direitos</h2>
          <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
          <ul>
            <li>
              <strong>Acesso:</strong> Confirmar a existência e acessar seus
              dados pessoais
            </li>
            <li>
              <strong>Correção:</strong> Solicitar correção de dados
              incompletos, inexatos ou desatualizados
            </li>
            <li>
              <strong>Exclusão:</strong> Solicitar a exclusão de dados pessoais
              tratados com seu consentimento
            </li>
            <li>
              <strong>Portabilidade:</strong> Solicitar a transferência de seus
              dados para outro fornecedor
            </li>
            <li>
              <strong>Revogação do Consentimento:</strong> Retirar seu
              consentimento a qualquer momento
            </li>
            <li>
              <strong>Oposição:</strong> Opor-se ao tratamento de dados em
              determinadas situações
            </li>
            <li>
              <strong>Informações sobre Compartilhamento:</strong> Obter
              informações sobre entidades com as quais compartilhamos seus dados
            </li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato conosco através do
            e-mail{" "}
            <a
              href="mailto:privacidade@bichocapiba.com.br"
              className={styles.link}
            >
              privacidade@bichocapiba.com.br
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais apenas pelo tempo necessário para
            cumprir as finalidades descritas nesta política, salvo quando um
            período de retenção mais longo for exigido ou permitido por lei.
          </p>
          <p>Critérios para determinar períodos de retenção:</p>
          <ul>
            <li>
              Dados de conta ativa são mantidos enquanto sua conta estiver ativa
            </li>
            <li>
              Dados de transações são mantidos conforme exigências fiscais e
              legais
            </li>
            <li>
              Dados de comunicação são mantidos pelo período necessário para
              resolver questões relacionadas
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. Cookies e Tecnologias Similares</h2>
          <p>Utilizamos cookies e tecnologias similares para:</p>
          <ul>
            <li>Manter você conectado à plataforma</li>
            <li>Lembrar suas preferências e configurações</li>
            <li>Analisar o uso da plataforma e melhorar funcionalidades</li>
            <li>Personalizar conteúdo e anúncios</li>
          </ul>
          <p>
            Você pode gerenciar suas preferências de cookies através das
            configurações do seu navegador. Note que desabilitar cookies pode
            afetar a funcionalidade da plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Privacidade de Menores</h2>
          <p>
            A plataforma Bicho Capiba não é direcionada a menores de 18 anos.
            Não coletamos intencionalmente informações pessoais de menores. Se
            você é pai, mãe ou responsável e acredita que seu filho forneceu
            informações pessoais, entre em contato conosco para que possamos
            tomar as medidas apropriadas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Links para Sites de Terceiros</h2>
          <p>
            Nossa plataforma pode conter links para sites de terceiros,
            incluindo sites de ONGs e abrigos parceiros. Não somos responsáveis
            pelas práticas de privacidade desses sites. Recomendamos que você
            leia as políticas de privacidade de todos os sites que visitar.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Transferência Internacional de Dados</h2>
          <p>
            Seus dados pessoais são armazenados e processados em servidores
            localizados no Brasil. Caso haja necessidade de transferência
            internacional, garantiremos que medidas de proteção adequadas
            estejam em vigor conforme exigido pela LGPD.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente para
            refletir mudanças em nossas práticas ou por razões legais,
            operacionais ou regulatórias. Notificaremos você sobre alterações
            significativas por e-mail ou através de aviso destacado na
            plataforma.
          </p>
          <p>
            Recomendamos que você revise esta política regularmente. O uso
            contínuo da plataforma após alterações constitui sua aceitação da
            política atualizada.
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Contato</h2>
          <p>
            Se você tiver dúvidas, preocupações ou solicitações relacionadas a
            esta Política de Privacidade ou ao tratamento de seus dados
            pessoais, entre em contato conosco:
          </p>
          <div className={styles.contactInfo}>
            <p>
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:privacidade@bichocapiba.com.br"
                className={styles.link}
              >
                privacidade@bichocapiba.com.br
              </a>
            </p>
            <p>
              <strong>E-mail de Suporte:</strong>{" "}
              <a
                href="mailto:suporte@bichocapiba.com.br"
                className={styles.link}
              >
                suporte@bichocapiba.com.br
              </a>
            </p>
          </div>
          <p>
            Você também tem o direito de apresentar uma reclamação à Autoridade
            Nacional de Proteção de Dados (ANPD) se acreditar que o tratamento
            de seus dados pessoais viola a LGPD.
          </p>
        </section>

        <section className={styles.section}>
          <h2>14. Consentimento</h2>
          <p>
            Ao utilizar a plataforma Bicho Capiba, você reconhece que leu,
            compreendeu e concorda com os termos desta Política de Privacidade.
          </p>
        </section>
      </div>
    </div>
  );
}
