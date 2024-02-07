# Overview

This web application is built upon nodejs and Expressjs framework, allows users to use third party APIs, those services are:

- Yandex map
- Dictionary
- Weather 
- Translate 

# Setup

To install the required dependencies, you need to type the following command:

```
npm install
```

to run the application:

```
node routes/app.js
```

# Endpoints

| Endpoints | Functionality |
| :---:   | :---: | 
| /weather | Exhibit weather of the specific city   | 
| /translate | translate whole sentences from russian to enligh or vice versa|
| /dictionary | displays word's meaning and its synonyms |


# Documentations

- [OpenWeather API](https://openweathermap.org/guide)
- [YandexMap API](https://yandex.com/dev/jsapi-v2-1/doc/en/#get-api-key)
- [Dictionary API](https://dictionaryapi.dev/)
- [https://yandex.com/dev/translate/doc/en/](https://yandex.com/dev/translate/doc/en/)
