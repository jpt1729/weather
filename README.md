# Weather Prediction

This is weather prediction project. Used to predict weather, specifically in Austin for Kalshi's bet weather.

As it stands, this app takes weather data from many different APIs and puts it all into one CSV

To get it running, get all your API keys loaded up in a .env file like 

```
TOMORROW_API_KEY=
OWM_API_KEY=
EMAIL=
ACCU_WEATHER_API_KEY=
WEATHER_API_KEY=
WEATHER_BIT_API_KEY=
VISUAL_CROSSING_API_KEY=
```

And then just run ```npm start``` and it should create a file in a folder ```data/``` with the name ```weather_data_[DATE]```

Long-term goals of this project:
- ML model to help predict specific weather in Austin giving weight to each models depending on their "accuracy."
- Turn this into a SaaS where people can get emails every day with the weather to "have better weather accuracy."

This is such a degen gambling project project, but yeah...