# Сделать стайт для просмотра даташитов. 

Что уже есть
- 80 000 даташитов на диске около 35Gb.
- 750 000 метаданных о компонентах 2GB в базе постгрес. 
- Свой фронтент фреймворк на онове voby/oby требует доработки базового функционала.
- Концепция создана на основе проекта Detonation и  Converged, DDFS

Как должен дработать mvp
- Даташиты, и файлы сайта должны храниться с своем блочном хранилище DDFS
- Фронетенд должен быть на 100% свой и работать на базе своего фреймворка Converged
- Бекенд должен работать на базе минимальной версии Detonation
  - Igniter - контроллер хоста (хранение данных, контроль контейнеров)
  - Сервис данных - Мета информация в Scylladb.
  - Gate - обработка входящих запросов.
- Слои контейнеров должны лежать на диске. 
- Конфигурация развертывания в ts файле.

- Интеграция технологий 
  
  - crun - для запуска контейнеров (легковесный runtime - https://github.com/containers/crun)
  - QuickJS - выполнение JS кода (https://github.com/quickjs/quickjs)
  - LSQUIC - https://github.com/litespeedtech/lsquic
  - BoringSSL - https://github.com/google/boringssl
  - Sucrase - как транслятор ts в js (https://github.com/alangpierce/sucrase)


