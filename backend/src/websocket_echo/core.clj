(ns websocket-echo.core
  (:require [org.httpkit.server :as http-kit]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))

;; WebSocket handler function
(defn websocket-handler [req]
  (http-kit/with-channel req channel
    (println "Client connected!")

    ;; Message receiving and echoing back to client
    (http-kit/on-receive channel
                         (fn [message]
                           (println "Received message:" message)
                           (http-kit/send! channel message)))

    ;; Handling connection closure
    (http-kit/on-close channel
                       (fn [status]
                         (println "Client disconnected! Status:" status)))))

;; Main app function that routes WebSocket requests
(defn app [req]
  (if (:websocket? req)
    (websocket-handler req)   ;; Handle WebSocket connection
    {:status 200
     :headers {"Content-Type" "text/plain"}
     :body "WebSocket server is running!"}))

;; Main function to start the server
(defn -main []
  (let [port 3000]
    (println (str "Server running on ws://localhost:" port))
    (http-kit/run-server (wrap-defaults #'app site-defaults) {:port port})))

