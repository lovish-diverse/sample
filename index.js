const WebSocket = require("ws");
const { dbConnect } = require("./utils/db");

const { getOpenTime, getCloseTime, getDefaultData } = require("./utils/utils");

class Trade {
  constructor(coin) {
    this.coin = coin;
    this.socketURL = `wss://ws.bitmex.com/realtime?subscribe=trade:${coin}`;
    this.ws = new WebSocket(this.socketURL);
  }

  getData = () => {
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

    let oneMinRecord = getDefaultData();
    let fiveMinRecord = getDefaultData();
    let fifteenMinRecord = getDefaultData();
    let oneHourRecord = getDefaultData();
    let fourHourRecord = getDefaultData();
    let oneDayRecord = getDefaultData();

    this.ws.on("message", function message(data) {
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
            if (!oneMinRecord.open) {
              oneMinRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (oneMinRecord.high < elem.price) {
              oneMinRecord["high"] = elem.price;
            }
            if (oneMinRecord.low > elem.price) {
              oneMinRecord["low"] = elem.price;
            }
            oneMinRecord["close"] = elem.price;
          });
        } else {
          oneMinRecord.openTime = oneMinOpenTime;
          oneMinRecord.closeTime = oneMinCloseTime;
          //   pushToDB(oneMinRecord);
          oneMinOpenTime = oneMinCloseTime;
          const newCloseTime = timeStamp.getTime();
          oneMinCloseTime = getCloseTime(newCloseTime, 1);
          oneMinRecord = getDefaultData();
        }

        if (timeStamp <= fiveMinCloseTime) {
          console.log("UNDER 5 MIN");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!fiveMinRecord.open) {
              fiveMinRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (fiveMinRecord.high < elem.price) {
              fiveMinRecord["high"] = elem.price;
            }
            if (fiveMinRecord.low > elem.price) {
              fiveMinRecord["low"] = elem.price;
            }
            fiveMinRecord["close"] = elem.price;
          });
        } else {
          fiveMinRecord.openTime = fiveMinOpenTime;
          fiveMinRecord.closeTime = fiveMinCloseTime;
          fiveMinOpenTime = fiveMinCloseTime;
          const newCloseTime = timeStamp.getTime();
          fiveMinCloseTime = getCloseTime(newCloseTime, 5);
          fiveMinRecord = getDefaultData();
        }

        if (timeStamp <= fifteenMinCloseTime) {
          console.log("UNDER 15 MIN");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!fifteenMinRecord.open) {
              fifteenMinRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (fifteenMinRecord.high < elem.price) {
              fifteenMinRecord["high"] = elem.price;
            }
            if (fifteenMinRecord.low > elem.price) {
              fifteenMinRecord["low"] = elem.price;
            }
            fifteenMinRecord["close"] = elem.price;
          });
        } else {
          fifteenMinRecord.openTime = fifteenMinOpenTime;
          fifteenMinRecord.closeTime = fifteenMinCloseTime;
          fifteenMinOpenTime = fifteenMinCloseTime;
          const newCloseTime = timeStamp.getTime();
          fifteenMinCloseTime = getCloseTime(newCloseTime, 5);
          fifteenMinRecord = getDefaultData();
        }

        if (timeStamp <= oneHourCloseTime) {
          console.log("UNDER 1 HOUR");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!oneHourRecord.open) {
              oneHourRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (oneHourRecord.high < elem.price) {
              oneHourRecord["high"] = elem.price;
            }
            if (oneHourRecord.low > elem.price) {
              oneHourRecord["low"] = elem.price;
            }
            oneHourRecord["close"] = elem.price;
          });
        } else {
          oneHourRecord.openTime = oneHourOpenTime;
          oneHourRecord.closeTime = oneHourCloseTime;
          oneHourOpenTime = oneHourCloseTime;
          const newCloseTime = timeStamp.getTime();
          oneHourCloseTime = getCloseTime(newCloseTime, 5);
          oneHourRecord = getDefaultData();
        }

        if (timeStamp <= fourHourCloseTime) {
          console.log("UNDER  4 HOUR");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!fourHourRecord.open) {
              fourHourRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (fourHourRecord.high < elem.price) {
              fourHourRecord["high"] = elem.price;
            }
            if (fourHourRecord.low > elem.price) {
              fourHourRecord["low"] = elem.price;
            }
            fourHourRecord["close"] = elem.price;
          });
        } else {
          fourHourRecord.openTime = fourHourOpenTime;
          fourHourRecord.closeTime = fourHourCloseTime;
          fourHourOpenTime = fourHourCloseTime;
          const newCloseTime = timeStamp.getTime();
          fourHourCloseTime = getCloseTime(newCloseTime, 5);
          fourHourRecord = getDefaultData();
        }

        if (timeStamp <= oneDayCloseTime) {
          console.log("UNDER 1 DAY");
          const recordArrInSameTime = reqData?.data;
          recordArrInSameTime.forEach((elem) => {
            if (!oneDayRecord.open) {
              oneDayRecord = {
                open: elem.price,
                close: elem.price,
                high: elem.price,
                low: elem.price,
              };
            }
            if (oneDayRecord.high < elem.price) {
              oneDayRecord["high"] = elem.price;
            }
            if (oneDayRecord.low > elem.price) {
              oneDayRecord["low"] = elem.price;
            }
            oneDayRecord["close"] = elem.price;
          });
        } else {
          oneDayRecord.openTime = oneDayOpenTime;
          oneDayRecord.closeTime = oneDayCloseTime;
          oneDayOpenTime = oneDayCloseTime;
          const newCloseTime = timeStamp.getTime();
          oneDayCloseTime = getCloseTime(newCloseTime, 5);
          oneDayRecord = getDefaultData();
        }
      }
    });
  };

  pushToDB(data) {
    dbConnect(this.coin)
      .then(() => {
        console.log("Pushing to db");
        console.log("Data", data);
      })
      .catch((err) => console.error(err));
  }
}

const t = new Trade("XBTUSD");
t.getData();
