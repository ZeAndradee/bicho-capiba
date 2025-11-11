import styles from "./page.module.css";

export const metadata = {
  title: "Termos de Uso | Bicho Capiba",
  description:
    "Termos de Uso da plataforma Bicho Capiba - Direitos e responsabilidades de usuários e ONGs",
};

export default function TermosPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Termos de Uso</h1>
          <p className={styles.date}>
            Última atualização: 11 de novembro de 2025
          </p>
        </header>

        <section className={styles.section}>
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Bem-vindo ao Bicho Capiba. Ao acessar e usar nossa plataforma, você
            concorda em cumprir e estar vinculado a estes Termos de Uso. Se você
            não concorda com qualquer parte destes termos, não deve usar nossa
            plataforma.
          </p>
          <p>
            Estes termos constituem um acordo legal entre você e o Bicho Capiba,
            regulando seu uso de todos os serviços oferecidos pela plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Descrição do Serviço</h2>
          <p>
            O Bicho Capiba é uma plataforma digital que conecta ONGs, abrigos de
            animais e futuros tutores, facilitando o processo de adoção
            responsável de animais. A plataforma oferece:
          </p>
          <ul>
            <li>Sistema de cadastro e perfis para usuários e ONGs</li>
            <li>Catálogo de animais disponíveis para adoção</li>
            <li>Sistema de comunicação entre tutores e ONGs</li>
            <li>Processamento de solicitações de adoção</li>
            <li>Sistema de doações para ONGs parceiras</li>
            <li>Recursos de busca e filtros personalizados</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Elegibilidade e Cadastro</h2>

          <h3>3.1. Requisitos de Idade</h3>
          <p>
            Você deve ter pelo menos 18 anos de idade para usar esta plataforma.
            Ao criar uma conta, você declara e garante que tem a idade mínima
            exigida.
          </p>

          <h3>3.2. Informações de Cadastro</h3>
          <p>
            Ao criar uma conta, você concorda em fornecer informações precisas,
            atuais e completas. Você é responsável por manter a
            confidencialidade de suas credenciais de acesso e por todas as
            atividades que ocorrem em sua conta.
          </p>

          <h3>3.3. Tipos de Conta</h3>
          <ul>
            <li>
              <strong>Usuário/Tutor:</strong> Pessoas físicas interessadas em
              adotar animais
            </li>
            <li>
              <strong>ONG/Abrigo:</strong> Organizações registradas que oferecem
              animais para adoção
            </li>
          </ul>

          <h3>3.4. Verificação de Identidade</h3>
          <p>
            Reservamo-nos o direito de verificar a identidade e legitimidade de
            usuários e ONGs. Contas que não puderem ser verificadas poderão ser
            suspensas ou encerradas.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Uso Aceitável da Plataforma</h2>

          <h3>4.1. Conduta Permitida</h3>
          <p>Ao usar a plataforma, você concorda em:</p>
          <ul>
            <li>Usar a plataforma apenas para fins legais e éticos</li>
            <li>Fornecer informações verdadeiras e precisas</li>
            <li>Respeitar outros usuários e ONGs</li>
            <li>
              Cumprir todas as leis aplicáveis relacionadas à adoção de animais
            </li>
            <li>Manter suas informações de contato atualizadas</li>
          </ul>

          <h3>4.2. Conduta Proibida</h3>
          <p>Você concorda em NÃO:</p>
          <ul>
            <li>Usar a plataforma para comércio ou venda de animais</li>
            <li>Fornecer informações falsas ou enganosas</li>
            <li>Assediar, ameaçar ou intimidar outros usuários</li>
            <li>Publicar conteúdo ilegal, ofensivo ou inadequado</li>
            <li>Violar direitos de propriedade intelectual</li>
            <li>Tentar acessar contas de outros usuários</li>
            <li>Usar scripts, bots ou automação não autorizada</li>
            <li>Interferir no funcionamento da plataforma</li>
            <li>Coletar dados de outros usuários sem permissão</li>
            <li>Solicitar ou adotar animais com intenções de maus-tratos</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Responsabilidades dos Usuários</h2>

          <h3>5.1. Para Futuros Tutores</h3>
          <ul>
            <li>
              Fornecer informações precisas sobre suas condições de moradia
            </li>
            <li>Avaliar honestamente sua capacidade de cuidar de um animal</li>
            <li>Comunicar-se de forma transparente com as ONGs</li>
            <li>Cumprir com os termos de adoção estabelecidos pela ONG</li>
            <li>Informar mudanças significativas em sua situação</li>
          </ul>

          <h3>5.2. Para ONGs e Abrigos</h3>
          <ul>
            <li>Manter informações precisas sobre animais disponíveis</li>
            <li>Fornecer informações completas sobre a saúde dos animais</li>
            <li>
              Processar solicitações de adoção de forma justa e transparente
            </li>
            <li>Atualizar o status de animais adotados prontamente</li>
            <li>Manter documentação adequada das adoções</li>
            <li>Cumprir com regulamentações locais sobre proteção animal</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. Processo de Adoção</h2>

          <h3>6.1. Função da Plataforma</h3>
          <p>
            O Bicho Capiba atua apenas como intermediário, facilitando o contato
            entre futuros tutores e ONGs. Não somos parte do contrato de adoção
            e não assumimos responsabilidade pelos acordos feitos entre as
            partes.
          </p>

          <h3>6.2. Termos de Adoção</h3>
          <p>
            Cada ONG estabelece seus próprios critérios e termos de adoção. Os
            usuários devem revisar e concordar com os termos específicos da ONG
            antes de finalizar uma adoção.
          </p>

          <h3>6.3. Recusa de Adoção</h3>
          <p>
            ONGs têm o direito de recusar solicitações de adoção com base em
            seus critérios de avaliação. A plataforma não interfere nessas
            decisões.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Doações</h2>

          <h3>7.1. Processamento</h3>
          <p>
            Facilitamos doações para ONGs parceiras através de processadores de
            pagamento terceirizados. Não armazenamos informações de cartão de
            crédito.
          </p>

          <h3>7.2. Destinação</h3>
          <p>
            Todas as doações vão diretamente para a ONG selecionada. O Bicho
            Capiba não retém nenhuma porcentagem das doações.
          </p>

          <h3>7.3. Reembolsos</h3>
          <p>
            Doações são geralmente não reembolsáveis. Para questões sobre
            reembolsos, entre em contato diretamente com a ONG destinatária.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Propriedade Intelectual</h2>

          <h3>8.1. Conteúdo da Plataforma</h3>
          <p>
            Todo o conteúdo da plataforma, incluindo textos, gráficos, logos,
            ícones, imagens, clipes de áudio e software, é propriedade do Bicho
            Capiba ou de seus fornecedores de conteúdo e é protegido por leis de
            direitos autorais.
          </p>

          <h3>8.2. Conteúdo do Usuário</h3>
          <p>
            Ao publicar conteúdo na plataforma (fotos, descrições, comentários),
            você concede ao Bicho Capiba uma licença não exclusiva, mundial,
            livre de royalties para usar, reproduzir, modificar e exibir esse
            conteúdo no contexto da operação da plataforma.
          </p>

          <h3>8.3. Marcas Registradas</h3>
          <p>
            Todas as marcas registradas, marcas de serviço e logotipos usados na
            plataforma são propriedade do Bicho Capiba ou de terceiros
            licenciadores.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Isenção de Responsabilidade</h2>

          <h3>9.1. Disponibilidade do Serviço</h3>
          <p>
            A plataforma é fornecida &quot;como está&quot; e &quot;conforme
            disponível&quot;. Não garantimos que o serviço será ininterrupto,
            seguro ou livre de erros.
          </p>

          <h3>9.2. Informações sobre Animais</h3>
          <p>
            Não verificamos independentemente as informações sobre animais
            fornecidas pelas ONGs. Os usuários devem realizar sua própria due
            diligence antes de adotar.
          </p>

          <h3>9.3. Relacionamentos entre Usuários</h3>
          <p>
            Não somos responsáveis por disputas ou problemas que surjam entre
            usuários e ONGs. Recomendamos que todas as transações sejam
            documentadas adequadamente.
          </p>

          <h3>9.4. Conteúdo de Terceiros</h3>
          <p>
            Links para sites externos são fornecidos apenas para conveniência.
            Não controlamos nem endossamos esses sites.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Limitação de Responsabilidade</h2>
          <p>
            Na extensão máxima permitida por lei, o Bicho Capiba não será
            responsável por:
          </p>
          <ul>
            <li>Danos diretos, indiretos, incidentais ou consequenciais</li>
            <li>Perda de lucros, dados ou oportunidades de negócio</li>
            <li>
              Danos resultantes de uso ou incapacidade de usar a plataforma
            </li>
            <li>Danos causados por ações de terceiros ou outros usuários</li>
            <li>
              Problemas decorrentes de adoções realizadas através da plataforma
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>11. Indenização</h2>
          <p>
            Você concorda em indenizar e isentar o Bicho Capiba, seus diretores,
            funcionários e parceiros de quaisquer reivindicações, perdas, danos,
            responsabilidades e despesas (incluindo honorários advocatícios)
            decorrentes de:
          </p>
          <ul>
            <li>Seu uso da plataforma</li>
            <li>Violação destes Termos de Uso</li>
            <li>Violação de direitos de terceiros</li>
            <li>Conteúdo que você publicar na plataforma</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>12. Suspensão e Encerramento de Conta</h2>

          <h3>12.1. Pelo Usuário</h3>
          <p>
            Você pode encerrar sua conta a qualquer momento através das
            configurações da plataforma ou entrando em contato conosco.
          </p>

          <h3>12.2. Pelo Bicho Capiba</h3>
          <p>Reservamo-nos o direito de suspender ou encerrar contas que:</p>
          <ul>
            <li>Violem estes Termos de Uso</li>
            <li>Estejam envolvidas em atividades fraudulentas</li>
            <li>Ameacem a segurança ou funcionalidade da plataforma</li>
            <li>Permaneçam inativas por período prolongado</li>
          </ul>

          <h3>12.3. Efeitos do Encerramento</h3>
          <p>
            Após o encerramento, você perde o acesso à sua conta e ao conteúdo
            associado. Algumas informações podem ser retidas conforme exigido
            por lei ou política de retenção de dados.
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Modificações dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos de Uso a qualquer
            momento. Alterações significativas serão notificadas através de:
          </p>
          <ul>
            <li>E-mail para o endereço cadastrado</li>
            <li>Aviso destacado na plataforma</li>
            <li>Notificação ao fazer login</li>
          </ul>
          <p>
            O uso contínuo da plataforma após as alterações constitui sua
            aceitação dos novos termos. Se você não concorda com as alterações,
            deve descontinuar o uso da plataforma.
          </p>
        </section>

        <section className={styles.section}>
          <h2>14. Lei Aplicável e Jurisdição</h2>
          <p>
            Estes Termos de Uso são regidos pelas leis da República Federativa
            do Brasil. Qualquer disputa relacionada a estes termos será
            submetida à jurisdição exclusiva dos tribunais brasileiros.
          </p>
        </section>

        <section className={styles.section}>
          <h2>15. Disposições Gerais</h2>

          <h3>15.1. Acordo Completo</h3>
          <p>
            Estes Termos de Uso, juntamente com nossa Política de Privacidade,
            constituem o acordo completo entre você e o Bicho Capiba.
          </p>

          <h3>15.2. Divisibilidade</h3>
          <p>
            Se qualquer disposição destes termos for considerada inválida ou
            inexequível, as demais disposições permanecerão em pleno vigor.
          </p>

          <h3>15.3. Renúncia</h3>
          <p>
            A falha em exercer qualquer direito ou disposição destes termos não
            constitui renúncia a esse direito ou disposição.
          </p>

          <h3>15.4. Cessão</h3>
          <p>
            Você não pode transferir ou ceder seus direitos ou obrigações sob
            estes termos sem nosso consentimento prévio por escrito.
          </p>
        </section>

        <section className={styles.section}>
          <h2>16. Contato</h2>
          <p>
            Para questões sobre estes Termos de Uso, entre em contato conosco:
          </p>
          <div className={styles.contactInfo}>
            <p>
              <strong>E-mail de Suporte:</strong>{" "}
              <a
                href="mailto:suporte@bichocapiba.com.br"
                className={styles.link}
              >
                suporte@bichocapiba.com.br
              </a>
            </p>
            <p>
              <strong>E-mail Jurídico:</strong>{" "}
              <a
                href="mailto:juridico@bichocapiba.com.br"
                className={styles.link}
              >
                juridico@bichocapiba.com.br
              </a>
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>17. Aceitação dos Termos</h2>
          <p>
            Ao criar uma conta e usar a plataforma Bicho Capiba, você reconhece
            que leu, compreendeu e concorda em cumprir estes Termos de Uso.
          </p>
        </section>
      </div>
    </div>
  );
}
