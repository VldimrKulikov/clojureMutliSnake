(defproject websocket-echo "0.1.0-SNAPSHOT"
  :description "WebSocket Echo Server"
  :target-path "target/%s"
  :dependencies [[org.clojure/clojure "1.11.1"]
                 [http-kit "2.8.0"]                     ;; Подключаем http-kit
                 [compojure "1.6.0"]                    ;; Подключаем compojure (роутинг/маршрутизация)
                 [ring/ring-defaults "0.3.4"]           ;; Джентльменский набор middleware по умолчанию 
                 [org.clojure/data.json "0.2.6"]        ;; Пригодится для работы с JSON
                 [org.clojure/core.async "1.6.681"]]      ;; Добавляем зависимость для core.async
  :profiles                                             ;; Профили для запуска lein with-profile <имя профиля>
  {:dev                                                 ;; Профиль разработки
   {:dependencies [[javax.servlet/servlet-api "2.5"]   ;; пригодится если вы будете устанавливать ring/ring-core
                   [ring/ring-devel "1.6.2"]]}}        ;; пригодится для горячей перезагрузки
  :main ^:skip-aot websocket-echo.core)       
