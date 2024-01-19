#include <HX711.h>
#include "Arduino.h"
#include "HX711.h"
#include "OneButton.h"
#include "pin_config.h"
#include <WiFi.h>
#include <HTTPClient.h>

#define WAIT 1

const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 21;
const float calibration_factor = -42516;

const long ZERO_WEIGHT = 0;
const int count_target = 5;

const char* ssid = "AndroidAP2222";    // 修改為你家的WiFi網路名稱
const char* pwd = "bwgg8380"; // 修改為你家的WiFi密碼
const char* serverName = "http://192.168.228.169:3000/drink";

long now_weight = 0;
long last_weight = 0;
int count = 0;

HX711 scale;
OneButton button1(PIN_BUTTON_2, true);

void connectwifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pwd);
  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(2500);
  }
  Serial.println("");
  Serial.print("IP位址:");
  Serial.println(WiFi.localIP()); // 讀取IP位址
  Serial.print("WiFi RSSI:");
  Serial.println(WiFi.RSSI()); // 讀取WiFi強度
}

void scaleinit() {
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);
  delay(1000);
  scale.tare();
}

void send_request(int value) {
  Serial.print("send request\n");
  Serial.print("val : ");
  Serial.println(value);

  if(WiFi.status() == WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
    
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");
      String httpRequestData = "{\"amount\":\"" + String(value) + "\"}";
      int httpResponseCode = http.POST(httpRequestData);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
    } else {
      connectwifi();
    }
}

void setup() {
  Serial.begin(9600);
  scaleinit();
  connectwifi();
}

void loop() {
  float fnum = scale.get_units(10) * 100;
  long num = (long)fnum;

  // 計算現在重量的持續時間
  if (now_weight > ZERO_WEIGHT && num == now_weight && count < count_target) {
    count++;
  } else {
    count = 0;
  }

  // 若重量讀數有變化，則在序列監視器中顯示新讀數
  if (num != now_weight) {
    now_weight = num;
    if(num < 0)
      num = 0;

    Serial.print("Weight: ");
    Serial.print(num);
    Serial.println(" grams");
  }

  // 檢測並記錄最後穩定的重量
  if (now_weight > ZERO_WEIGHT && now_weight >= last_weight && count >= count_target) {
    last_weight = now_weight;
    Serial.print("last_weight val : ");
    Serial.println(last_weight);
    count = 0;
  }

  // 檢測重量變化並發送請求
  if (count >= count_target && last_weight - now_weight != 0) {
    send_request(last_weight - now_weight);
    count = 0;
    last_weight = now_weight;
  }

  delay(WAIT);
}
