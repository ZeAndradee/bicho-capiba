import styles from "./page.module.css";

export const metadata = {
  title: "Política de Cookies | Bicho Capiba",
  description:
    "Política de Cookies da plataforma Bicho Capiba - Como utilizamos cookies e tecnologias similares",
};

export default function CookiesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Política de Cookies</h1>
          <p className={styles.date}>
            Última atualização: 11 de novembro de 2025
          </p>
        </header>

        <section className={styles.section}>
          <h2>1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu
            dispositivo (computador, tablet ou smartphone) quando você visita um
            site. Eles são amplamente utilizados para fazer os sites funcionarem
            de forma mais eficiente, além de fornecer informações aos
            proprietários do site.
          </p>
          <p>
            Os cookies permitem que o site reconheça seu dispositivo e armazene
            algumas informações sobre suas preferências ou ações anteriores,
            tornando sua experiência mais conveniente e personalizada.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Como Utilizamos Cookies</h2>
          <p>
            O Bicho Capiba utiliza cookies e tecnologias similares para diversos
            propósitos:
          </p>
          <ul>
            <li>Manter você conectado à sua conta</li>
            <li>Lembrar suas preferências e configurações</li>
            <li>Entender como você usa a plataforma</li>
            <li>Melhorar a funcionalidade e desempenho do site</li>
            <li>Personalizar conteúdo e recomendações</li>
            <li>Analisar o tráfego e comportamento dos usuários</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Tipos de Cookies que Utilizamos</h2>

          <h3>3.1. Cookies Essenciais (Necessários)</h3>
          <p>
            Estes cookies são fundamentais para o funcionamento da plataforma e
            não podem ser desativados em nossos sistemas. Geralmente são
            definidos apenas em resposta a ações suas que equivalem a uma
            solicitação de serviços.
          </p>
          <p>
            <strong>Exemplos de uso:</strong>
          </p>
          <ul>
            <li>Manter você conectado à sua conta durante a navegação</li>
            <li>Lembrar informações inseridas em formulários</li>
            <li>Garantir segurança e prevenir fraudes</li>
            <li>Habilitar funcionalidades básicas da plataforma</li>
          </ul>
          <p>
            <strong>Duração:</strong> Sessão ou até 1 ano
          </p>

          <h3>3.2. Cookies de Desempenho (Analíticos)</h3>
          <p>
            Estes cookies nos permitem contar visitas e fontes de tráfego para
            que possamos medir e melhorar o desempenho do nosso site. Eles nos
            ajudam a saber quais páginas são mais e menos populares e ver como
            os visitantes se movem pelo site.
          </p>
          <p>
            <strong>Exemplos de uso:</strong>
          </p>
          <ul>
            <li>Analisar padrões de navegação dos usuários</li>
            <li>Identificar páginas com erros ou problemas</li>
            <li>Medir tempos de carregamento</li>
            <li>Entender quais recursos são mais utilizados</li>
          </ul>
          <p>
            <strong>Ferramentas utilizadas:</strong> Google Analytics
          </p>
          <p>
            <strong>Duração:</strong> Até 2 anos
          </p>

          <h3>3.3. Cookies de Funcionalidade</h3>
          <p>
            Estes cookies permitem que o site forneça funcionalidade e
            personalização aprimoradas. Podem ser definidos por nós ou por
            fornecedores terceiros cujos serviços adicionamos às nossas páginas.
          </p>
          <p>
            <strong>Exemplos de uso:</strong>
          </p>
          <ul>
            <li>Lembrar suas preferências de filtro de busca</li>
            <li>Salvar suas configurações de visualização</li>
            <li>Recordar animais que você marcou como favoritos</li>
            <li>Manter preferências de idioma e localização</li>
          </ul>
          <p>
            <strong>Duração:</strong> Até 1 ano
          </p>

          <h3>3.4. Cookies de Marketing (Publicidade)</h3>
          <p>
            Estes cookies podem ser definidos através do nosso site por nossos
            parceiros de publicidade. Podem ser usados por essas empresas para
            construir um perfil de seus interesses e mostrar anúncios relevantes
            em outros sites.
          </p>
          <p>
            <strong>Exemplos de uso:</strong>
          </p>
          <ul>
            <li>Exibir campanhas de adoção relevantes</li>
            <li>Mostrar anúncios de ONGs parceiras</li>
            <li>Rastrear eficácia de campanhas publicitárias</li>
            <li>Personalizar conteúdo promocional</li>
          </ul>
          <p>
            <strong>Parceiros:</strong> Google Ads, Facebook Pixel
          </p>
          <p>
            <strong>Duração:</strong> Até 2 anos
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Cookies de Terceiros</h2>
          <p>
            Alguns cookies são colocados por serviços de terceiros que aparecem
            em nossas páginas. Utilizamos diversos serviços de terceiros
            confiáveis:
          </p>

          <h3>4.1. Google Analytics</h3>
          <p>
            Utilizamos o Google Analytics para entender como os usuários
            interagem com nossa plataforma. Estes cookies coletam informações de
            forma agregada e anônima.
          </p>
          <ul>
            <li>_ga: Identificador único de usuário</li>
            <li>_gid: Identificador único de sessão</li>
            <li>_gat: Controle de taxa de solicitações</li>
          </ul>

          <h3>4.2. Serviços de Autenticação</h3>
          <p>
            Para facilitar o login, utilizamos serviços de autenticação de
            terceiros que podem definir seus próprios cookies.
          </p>

          <h3>4.3. Redes Sociais</h3>
          <p>
            Botões de compartilhamento social (Facebook, Instagram, Twitter)
            podem definir cookies para rastrear interações.
          </p>

          <h3>4.4. Processadores de Pagamento</h3>
          <p>
            Para processar doações, utilizamos serviços de pagamento que podem
            definir cookies para fins de segurança e prevenção de fraudes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Outras Tecnologias Similares</h2>

          <h3>5.1. Web Beacons (Pixels)</h3>
          <p>
            Pequenas imagens gráficas invisíveis embutidas em páginas web ou
            e-mails que nos permitem rastrear visualizações e interações.
          </p>

          <h3>5.2. Local Storage</h3>
          <p>
            Armazenamento local no navegador que permite salvar dados de forma
            mais persistente que cookies tradicionais.
          </p>

          <h3>5.3. Session Storage</h3>
          <p>
            Armazenamento temporário que persiste apenas durante a sessão de
            navegação atual.
          </p>

          <h3>5.4. Fingerprinting</h3>
          <p>
            Técnica que coleta informações sobre a configuração do seu navegador
            e dispositivo para criar um identificador único, usado
            principalmente para segurança.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Como Gerenciar Cookies</h2>

          <h3>6.1. Configurações do Navegador</h3>
          <p>
            A maioria dos navegadores web permite que você controle cookies
            através das configurações. Você pode:
          </p>
          <ul>
            <li>Ver quais cookies estão armazenados</li>
            <li>Excluir todos ou cookies específicos</li>
            <li>Bloquear cookies de sites específicos</li>
            <li>Bloquear todos os cookies de terceiros</li>
            <li>Limpar todos os cookies ao fechar o navegador</li>
          </ul>

          <h3>6.2. Como Acessar Configurações</h3>
          <p>
            <strong>Google Chrome:</strong>
          </p>
          <ul>
            <li>Menu → Configurações → Privacidade e segurança → Cookies</li>
          </ul>
          <p>
            <strong>Mozilla Firefox:</strong>
          </p>
          <ul>
            <li>Menu → Opções → Privacidade e Segurança → Cookies</li>
          </ul>
          <p>
            <strong>Safari:</strong>
          </p>
          <ul>
            <li>Preferências → Privacidade → Cookies</li>
          </ul>
          <p>
            <strong>Microsoft Edge:</strong>
          </p>
          <ul>
            <li>Menu → Configurações → Privacidade → Cookies</li>
          </ul>

          <h3>6.3. Ferramentas de Opt-Out</h3>
          <p>Você pode desativar cookies de publicidade através de:</p>
          <ul>
            <li>
              <a
                href="https://www.google.com/settings/ads"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Configurações de Anúncios do Google
              </a>
            </li>
            <li>
              <a
                href="https://optout.networkadvertising.org"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Network Advertising Initiative
              </a>
            </li>
            <li>
              <a
                href="https://www.aboutads.info/choices"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Digital Advertising Alliance
              </a>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Consequências de Desativar Cookies</h2>
          <p>
            Se você optar por desativar cookies, algumas funcionalidades da
            plataforma podem não funcionar adequadamente:
          </p>
          <ul>
            <li>Você pode ser desconectado frequentemente</li>
            <li>Suas preferências não serão salvas</li>
            <li>Algumas páginas podem não carregar corretamente</li>
            <li>A experiência será menos personalizada</li>
            <li>Funcionalidades de busca podem ser limitadas</li>
          </ul>
          <p>
            <strong>Nota:</strong> Cookies essenciais são necessários para o
            funcionamento básico da plataforma e não podem ser desativados sem
            afetar seriamente a usabilidade.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Cookies e Dispositivos Móveis</h2>
          <p>
            Nossa plataforma também funciona em dispositivos móveis, e cookies
            podem ser armazenados através de navegadores móveis ou aplicativos.
          </p>

          <h3>8.1. Navegadores Móveis</h3>
          <p>
            As configurações de cookies em navegadores móveis são similares às
            versões desktop, geralmente encontradas nas configurações do
            navegador.
          </p>

          <h3>8.2. Identificadores Móveis</h3>
          <p>
            Em dispositivos móveis, também podemos usar identificadores
            específicos do dispositivo (como IDFA no iOS ou Android ID) para
            finalidades similares aos cookies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Atualizações desta Política</h2>
          <p>
            Podemos atualizar esta Política de Cookies periodicamente para
            refletir mudanças em nossas práticas ou por razões operacionais,
            legais ou regulatórias.
          </p>
          <p>
            Quando fizermos alterações significativas, notificaremos você
            através de:
          </p>
          <ul>
            <li>Aviso na plataforma</li>
            <li>
              Atualização da data &quot;Última atualização&quot; no topo desta
              página
            </li>
            <li>E-mail, quando apropriado</li>
          </ul>
          <p>
            Recomendamos que você revise esta política regularmente para se
            manter informado sobre como utilizamos cookies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Conformidade com a LGPD</h2>
          <p>
            Nossa utilização de cookies está em conformidade com a Lei Geral de
            Proteção de Dados (LGPD) do Brasil. Respeitamos seus direitos de
            privacidade e fornecemos transparência sobre como coletamos e
            utilizamos dados.
          </p>
          <p>
            <strong>Seus direitos incluem:</strong>
          </p>
          <ul>
            <li>Direito de saber quais cookies são utilizados</li>
            <li>Direito de recusar cookies não essenciais</li>
            <li>Direito de acessar dados coletados através de cookies</li>
            <li>Direito de solicitar exclusão de dados</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>11. Cookies e Segurança</h2>
          <p>
            Utilizamos cookies como parte de nossas medidas de segurança para:
          </p>
          <ul>
            <li>Detectar e prevenir atividades fraudulentas</li>
            <li>Proteger contra acesso não autorizado</li>
            <li>Identificar padrões de uso suspeitos</li>
            <li>Implementar autenticação de dois fatores</li>
            <li>Verificar a integridade de sessões</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>12. Durações de Cookies</h2>
          <p>Os cookies que utilizamos têm diferentes durações:</p>

          <h3>12.1. Cookies de Sessão</h3>
          <p>
            Temporários e são excluídos quando você fecha o navegador. Usados
            principalmente para manter sua sessão de login ativa.
          </p>

          <h3>12.2. Cookies Persistentes</h3>
          <p>
            Permanecem no seu dispositivo por um período definido (dias, meses
            ou anos) ou até que você os exclua manualmente. Usados para lembrar
            preferências entre visitas.
          </p>

          <h3>12.3. Tabela de Durações</h3>
          <ul>
            <li>
              <strong>Autenticação:</strong> 7-30 dias
            </li>
            <li>
              <strong>Preferências:</strong> 365 dias
            </li>
            <li>
              <strong>Analytics:</strong> 730 dias (2 anos)
            </li>
            <li>
              <strong>Marketing:</strong> 90-730 dias
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>13. Contato</h2>
          <p>
            Se você tiver dúvidas sobre nossa utilização de cookies ou esta
            política, entre em contato conosco:
          </p>
          <div className={styles.contactInfo}>
            <p>
              <strong>E-mail de Privacidade:</strong>{" "}
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
        </section>

        <section className={styles.section}>
          <h2>14. Consentimento</h2>
          <p>
            Ao continuar a usar nossa plataforma, você consente com o uso de
            cookies conforme descrito nesta Política de Cookies. Para cookies
            não essenciais, solicitaremos seu consentimento explícito através do
            banner de cookies exibido na primeira visita.
          </p>
          <p>
            Você pode retirar ou modificar seu consentimento a qualquer momento
            através das configurações de cookies na plataforma ou do seu
            navegador.
          </p>
        </section>
      </div>
    </div>
  );
}
