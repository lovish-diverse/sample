const WebSocket = require("ws");
const { dbConnect } = require("./utils/db");

const { getOpenTime, getCloseTime, getDefaultData } = require("./utils/utils");

class Trade {
  constructor(coin) {
    this.coin = coin;
    this.socketURL = `wss://ws.bitmex.com/realtime?subscribe=trade:${coin}`;
    this.ws = new WebSocket(this.socketURL);
    this.oneMinRecord = getDefaultData();
    this.fiveMinRecord = getDefaultData();
    this.fifteenMinRecord = getDefaultData();
    this.oneHourRecord = getDefaultData();
    this.fourHourRecord = getDefaultData();
    this.oneDayRecord = getDefaultData();
  }

  getData() {
    const d = new Date().getTime();
    let oneMinOpenTime = getOpenTime(d, 1);
    let oneMinCloseTime = getCloseTime(d, 1);
    let fiveMinOpenTime = getOpenTime(d, 5);
    let fiveMinCloseTime = getCloseTime(d, 5);
    let fifteenMinOpenTime = getOpenTime(d, 15);
    let fifteenMinCloseTime = getCloseTime(d, 15);
    let oneHourOpenTime = getOpenTime(d, 60);
    let oneHourCloseTime = getCloseTime(d, 60);
    let fourHourOpenTime = getOpenTime(d, 4 * 60);
    let fourHourCloseTime = getCloseTime(d, 4 * 60);
    let oneDayOpenTime = getOpenTime(d, 24 * 60);
    let oneDayCloseTime = getCloseTime(d, 24 * 60);

    this.ws.on("message", (data) => {
      const reqData = JSON.parse(data.toString());
      //   console.log(reqData);
      if (typeof reqData !== undefined && reqData.data) {
        const timeStamp = new Date(reqData?.data?.[0]?.timestamp);

        // console.log("timestamp", timeStamp);
        // console.log("start", oneMinOpenTime);
        // console.log("end", oneMinCloseTime);
        // console.log(timeStamp < oneMinCloseTime);

        if (timeStamp <= oneMinCloseTime) {
          console.log("UNDER 1 MIN");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!this.oneMinRecord.open) {
              this.oneMinRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (this.oneMinRecord.high < elem.price) {
              this.oneMinRecord["high"] = elem.price;
            }
            if (this.oneMinRecord.low > elem.price) {
              this.oneMinRecord["low"] = elem.price;
            }
            this.oneMinRecord["close"] = elem.price;
          });
        } else {
          this.oneMinRecord.openTime = oneMinOpenTime;
          this.oneMinRecord.closeTime = oneMinCloseTime;
          this.oneMinRecord.key = "ONEMIN";
          this.pushToDB(this.oneMinRecord);
          oneMinOpenTime = oneMinCloseTime;
          const newCloseTime = timeStamp.getTime();
          oneMinCloseTime = getCloseTime(newCloseTime, 1);
          this.oneMinRecord = getDefaultData();
        }

        if (timeStamp <= fiveMinCloseTime) {
          console.log("UNDER 5 MIN");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!this.fiveMinRecord.open) {
              this.fiveMinRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (this.fiveMinRecord.high < elem.price) {
              this.fiveMinRecord["high"] = elem.price;
            }
            if (this.fiveMinRecord.low > elem.price) {
              this.fiveMinRecord["low"] = elem.price;
            }
            this.fiveMinRecord["close"] = elem.price;
          });
        } else {
          this.fiveMinRecord.openTime = fiveMinOpenTime;
          this.fiveMinRecord.closeTime = fiveMinCloseTime;
          this.fiveMinRecord.key = "FIVEMIN";
          this.pushToDB(this.fiveMinRecord);
          fiveMinOpenTime = fiveMinCloseTime;
          const newCloseTime = timeStamp.getTime();
          fiveMinCloseTime = getCloseTime(newCloseTime, 5);
          this.fiveMinRecord = getDefaultData();
        }

        if (timeStamp <= fifteenMinCloseTime) {
          console.log("UNDER 15 MIN");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!this.fifteenMinRecord.open) {
              this.fifteenMinRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (this.fifteenMinRecord.high < elem.price) {
              this.fifteenMinRecord["high"] = elem.price;
            }
            if (this.fifteenMinRecord.low > elem.price) {
              this.fifteenMinRecord["low"] = elem.price;
            }
            this.fifteenMinRecord["close"] = elem.price;
          });
        } else {
          this.fifteenMinRecord.openTime = fifteenMinOpenTime;
          this.fifteenMinRecord.closeTime = fifteenMinCloseTime;
          this.fifteenMinRecord.key = "FIFTEENMIN";
          this.pushToDB(this.fifteenMinRecord);
          fifteenMinOpenTime = fifteenMinCloseTime;
          const newCloseTime = timeStamp.getTime();
          fifteenMinCloseTime = getCloseTime(newCloseTime, 5);
          this.fifteenMinRecord = getDefaultData();
        }

        if (timeStamp <= oneHourCloseTime) {
          console.log("UNDER 1 HOUR");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!this.oneHourRecord.open) {
              this.oneHourRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (this.oneHourRecord.high < elem.price) {
              this.oneHourRecord["high"] = elem.price;
            }
            if (this.oneHourRecord.low > elem.price) {
              this.oneHourRecord["low"] = elem.price;
            }
            this.oneHourRecord["close"] = elem.price;
          });
        } else {
          this.oneHourRecord.openTime = oneHourOpenTime;
          this.oneHourRecord.closeTime = oneHourCloseTime;
          this.oneHourRecord.key = "ONEHOUR";
          this.pushToDB(this.oneHourRecord);
          oneHourOpenTime = oneHourCloseTime;
          const newCloseTime = timeStamp.getTime();
          oneHourCloseTime = getCloseTime(newCloseTime, 5);
          this.oneHourRecord = getDefaultData();
        }

        if (timeStamp <= fourHourCloseTime) {
          console.log("UNDER  4 HOUR");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!this.fourHourRecord.open) {
              this.fourHourRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (this.fourHourRecord.high < elem.price) {
              this.fourHourRecord["high"] = elem.price;
            }
            if (this.fourHourRecord.low > elem.price) {
              this.fourHourRecord["low"] = elem.price;
            }
            this.fourHourRecord["close"] = elem.price;
          });
        } else {
          this.fourHourRecord.openTime = fourHourOpenTime;
          this.fourHourRecord.closeTime = fourHourCloseTime;
          this.fourHourRecord.key = "FOURHOUR";
          this.pushToDB(this.fourHourRecord);
          fourHourOpenTime = fourHourCloseTime;
          const newCloseTime = timeStamp.getTime();
          fourHourCloseTime = getCloseTime(newCloseTime, 5);
          this.fourHourRecord = getDefaultData();
        }

        if (timeStamp <= oneDayCloseTime) {
          console.log("UNDER 1 DAY");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!this.oneDayRecord.open) {
              this.oneDayRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (this.oneDayRecord.high < elem.price) {
              this.oneDayRecord["high"] = elem.price;
            }
            if (this.oneDayRecord.low > elem.price) {
              this.oneDayRecord["low"] = elem.price;
            }
            this.oneDayRecord["close"] = elem.price;
          });
        } else {
          this.oneDayRecord.openTime = oneDayOpenTime;
          this.oneDayRecord.closeTime = oneDayCloseTime;
          this.oneDayRecord.key = "ONEDAY";
          this.pushToDB(this.oneDayRecord);
          oneDayOpenTime = oneDayCloseTime;
          const newCloseTime = timeStamp.getTime();
          oneDayCloseTime = getCloseTime(newCloseTime, 5);
          this.oneDayRecord = getDefaultData();
        }
      }
    });
  }

  pushToDB(data) {
    dbConnect(this.coin)
      .then((db) => {
        console.log("Pushing to db", this.coin);
        console.log("Data", data);
        db.collection(`${this.coin}-Trade-${data.key}`)
          .insertOne({ ...data, createdAt: new Date() })
          .then((doc) => console.log("Inserted Successfully", doc))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.error(err));
  }
}

const t = new Trade("XBTUSD");
t.getData();

const t2 = new Trade("ETHUSD");
t2.getData();
