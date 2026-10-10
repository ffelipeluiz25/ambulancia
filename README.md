# Controle de Ambulâncias

App de controle de saída e chegada de ambulâncias. É um único `www/index.html` (HTML + JS puro) que roda
no navegador e também como **APK Android offline**, empacotado com [Capacitor](https://capacitorjs.com).

Regras de negócio e estrutura de dados: [CONTEXTO.md](CONTEXTO.md).

## Estrutura

| Caminho | O que é |
|---|---|
| `www/index.html` | O app inteiro (única fonte de código) |
| `www/vendor/` | Bootstrap, Bootstrap Icons e jsPDF copiados de `node_modules` (gerado, fora do git) |
| `android/` | Projeto Android nativo gerado pelo Capacitor |
| `assets/` | PNGs-fonte do ícone e splash (gerados por `scripts/icons.mjs`) |
| `scripts/vendor.mjs` | Copia as bibliotecas para `www/vendor` |
| `capacitor.config.json` | appId `com.ffelipeluiz25.ambulancias`, nome do app |

## Ambiente (já instalado nesta máquina)

| Ferramenta | Local |
|---|---|
| Node.js 22 | `D:\Program Files\nodejs` |
| JDK 21 (Temurin) | `D:\DevTools\java\jdk-21.0.12.1+1` (`JAVA_HOME`) |
| Android SDK (platform 36, build-tools 36, platform-tools) | `D:\DevTools\android-sdk` (`ANDROID_HOME`) |
| Cache do Gradle | `D:\DevCache\gradle` (`GRADLE_USER_HOME`) |
| Keystore de release | `D:\DevTools\keystores\ambulancias-release.jks` |

As variáveis de ambiente estão no usuário do Windows; abrir um terminal novo depois da instalação.

## Comandos

```bash
npm install            # primeira vez, depois de clonar
npm run vendor         # copia as bibliotecas para www/vendor (necessário até para abrir no navegador)
npm run apk:release    # gera android/app/build/outputs/apk/release/app-release.apk (assinado)
npm run apk:debug      # gera APK de debug
```

Fluxo ao alterar o app: editar `www/index.html`, testar no navegador, rodar `npm run apk:release`,
**aumentar `versionCode`/`versionName`** em `android/app/build.gradle` antes de distribuir uma versão nova.

Instalar no celular: copiar o APK para o aparelho e abrir (permitir "instalar apps de fontes desconhecidas"),
ou com o celular em modo depuração USB: `adb install -r app-release.apk`.

## Assinatura (importante)

O APK de release é assinado com `D:\DevTools\keystores\ambulancias-release.jks`. A senha está em
`android/keystore.properties` (fora do git) e em uma cópia em `D:\DevTools\keystores\ambulancias-release.properties`.

**Faça backup do `.jks` e da senha fora desta máquina.** Sem eles, uma versão nova não instala por cima da
antiga: seria preciso desinstalar o app, o que **apaga todos os dados** do aparelho.

## Diferenças no app Android

- Bibliotecas embutidas: funciona sem internet.
- **Download Relatório** salva o PDF em `Documentos/ControleAmbulancias/Relatorios/<ddmmaaaa>/` e oferece compartilhar.
- **Exportar** salva o JSON em `Documentos/ControleAmbulancias/Backups/` e oferece compartilhar.
- "Imprimir Relatório" e "Redefinir pasta de relatórios" ficam ocultos (não existem na WebView); para imprimir, compartilhe o PDF.
- Botão voltar do Android: fecha modal/menu, volta ao Dashboard, depois sai do app.
- Os dados ficam no `localStorage` do app. Desinstalar o app apaga os dados: use **Exportar** como backup.

## Git

Repositório: `git@github.com:ffelipeluiz25/ambulancia.git`. A conta e a chave SSH (`id_ed25519_ffelipeluiz25`)
são aplicadas só a este diretório via `includeIf` no `~/.gitconfig`, que inclui `~/.gitconfig-ffelipeluiz25`.
