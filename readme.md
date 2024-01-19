## 嵌入式期末專題 —— 喝水記錄智慧水杯

程式碼分爲esp32硬件部分與基於flask架構實現GUI界面的前後端程式碼。

esp32透過socket與後端建立連綫，因此需要與後端處在同一個網路環境，在tft.ino輸入與後端所使用的網路相同的Wifi名稱與密碼后就可以開始燒錄ESP32。

GUI的部分由flask架構實現，只需執行flask_webpage中的server.py后，于瀏覽器輸入localhost IP后即可顯示GUI界面。

