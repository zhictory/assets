//获取所有设置
var commandGetSettings = "aaaa810020ac";
var commandUpdate1 = "aaaaa804006465a561f1";
var commandUpdate4 = "aaaaa804006465a564df";
var commandShutterDown = "aaaaa804006465a632db";

window.onload = function () {
  if (window.hilink) {
    onBluetoothAdapterStateChange(); // 监听蓝牙模块开启/关闭 触发
    onBLEConnectionStateChange(); // 监听低功耗蓝牙设备连接状态的改变
    getBluetoothAdapterState(); // 蓝牙模块状态是否打开
  }
};

//版本号，int类型
var remoteVersion1 = 0;
var remoteVersion4 = 0;
var localVersion1 = 0;
var localVersion4 = 0;

//固件，file类型
var gimbalBin_1;
var gimbalBin_1_st;
var gimbalBin_1_st_302;
var gimbalBin_4;

//固件数据，十六进制String
var binData = "";

//固件分多少组发送，int类型
var groupNum = 0;

var deviceIdMac = ""; //注册时候的mac地址
var UUID_OR_Mac = ""; //通过扫描设备拿到的devicesID, 安卓是mac地址, ios是UUID
var isDiscover = false;
var isConnect = false;
var notifyUuids = [
  {
    switchOn: "00", //下发数据为16进制, 不要带0x
    switchOff: "01",
    serviceUuid: "22b3a000-2617-f8c9-d28a-6728eaeaeaae",
    readCharacteristicUuid: "000000c8-0000-1000-8000-00805f9b34fb",
    writeCharacteristicUuid: "000000dc-0000-1000-8000-00805f9b34fb",
  },
];

var isIOS = !!navigator.userAgent.match(/iPhone/i);

var loadingImg = document.getElementsByClassName("loadingImg")[0];
var batteryInfo = document.getElementsByClassName("batteryInfo")[0];
var batteryImg = document.getElementsByClassName("batteryImg")[0];
var batteryNum = document.getElementsByClassName("batteryNum")[0];
var devUpdate = document.getElementsByClassName("devFn")[0];

var statusLeft = document.getElementsByClassName("statusLeft")[0];
var reconnect = document.getElementsByClassName("reconnect")[0];
var firmwareVersion = document.getElementsByClassName("firmwareVersion")[0];
var firmwarePoint = document.getElementsByClassName("firmwarePoint")[0];

var pageControl = document.getElementsByClassName("pageControl")[0];
var pageUpdate = document.getElementsByClassName("pageUpdate")[0];

var devMore = document.getElementsByClassName("devMore")[0];

var backgroundColor = document.getElementsByClassName("backgroundColor")[0];
var tipLater = document.getElementsByClassName("tipLater")[0];
var tipReconnect = document.getElementsByClassName("tipReconnect")[0];
var firmwareUpdate = document.getElementsByClassName("firmwareUpdate")[0];
var devName = document.getElementsByClassName("devName")[0];

var circleRight = document.getElementsByClassName("circleRight")[0];
var circleLeft = document.getElementsByClassName("circleLeft")[0];
var rightColorStop = this.document.getElementById("rightColorStop");
var leftColorStart = this.document.getElementById("leftColorStart");

batteryInfo.style.display = "none";
firmwarePoint.style.visibility = "hidden";
reconnect.style.display = "none";
devUpdate.style.opacity = 0.6;

tipLater.addEventListener("click", function (event) {
  backgroundColor.style.display = "none";

  event.stopPropagation();
});

tipReconnect.addEventListener("click", function (event) {
  backgroundColor.style.display = "none";
  onBluetoothDeviceFound(); // 重新发现，匹配
  event.stopPropagation();
});

devMore.addEventListener("click", function (event) {
  hilink.jumpTo(
    "com.huawei.smarthome.deviceSettingActivity", // uri,String, 跳转到设备信息页面的uri
    "resultCallback" // resultCallback，成功或失败时，将调用传入resultStr返回结果
  );

  window.resultCallback = (res) => {
    console.log("res:", res);
  };

  event.stopPropagation();
});

// 退出当前设备页，返回APP设备列表页
var barLeft = document.getElementsByClassName("barLeft")[0];
barLeft.addEventListener("click", function (event) {
  if (window.getComputedStyle(pageControl).display === "none") {
    pageControl.style.display = "";
    pageUpdate.style.display = "none";
    devMore.style.display = "";
    devName.innerHTML = "FUNSNAP Capture Pi";
  } else {
    if (window.hilink) {
      hilink.finishDeviceActivity();
    }
  }

  event.stopPropagation();
});

devUpdate.addEventListener("click", function (event) {
  if (remoteVersion1 > localVersion1 || remoteVersion4 > localVersion4) {
    pageControl.style.display = "none";
    pageUpdate.style.display = "";
    devMore.style.display = "none";
    devName.innerHTML = "固件更新";
  }

  event.stopPropagation();
});

reconnect.addEventListener("click", function (event) {
  onBluetoothDeviceFound(); // 重新发现，匹配
  event.stopPropagation();
});

// 接口返回数据格式的转换
function d(res) {
  let data = undefined;
  let dataStr = res;
  dataStr = dataStr.replace(/"{/g, "{");
  dataStr = dataStr.replace(/}"/g, "}");
  dataStr = dataStr.replace(/\\|\n|\r|\t|\f|\t/g, "");
  data = JSON.parse(dataStr);

  return data;
}

// 监听蓝牙模块--蓝牙模块开启和关闭的时候触发
function onBluetoothAdapterStateChange() {
  window.hilink.onBluetoothAdapterStateChange("bluetoothStateChangeCallback");

  window.bluetoothStateChangeCallback = (res) => {
    let data = d(res);
    console.log("主动打开或关闭蓝牙模块:", data.available);
    if (data.available) {
      getCurrentRegisteredDevice(); // 获取当前设备的mac地址
    } else {
      window.hilink.openBluetoothAdapter();
    }
  };
}

// 蓝牙设备连接-----
// 1.获取当前蓝牙模块状态，判断当前蓝牙是否处于打开状态。
function getBluetoothAdapterState() {
  window.hilink.getBluetoothAdapterState("getBluetoothAdapterStateCallback");

  window.getBluetoothAdapterStateCallback = (res) => {
    let data = d(res);
    console.log("当前蓝牙模块状态:", data.available);
    if (data.available) {
      getCurrentRegisteredDevice(); // 获取当前设备的mac地址
    } else {
      window.hilink.openBluetoothAdapter(); // 蓝牙未打开，则请求打开
    }
  };
}

// 2.监听蓝牙设备连接状态，连接结果通过回调得知(先监听后连接)
function onBLEConnectionStateChange() {
  window.hilink.onBLEConnectionStateChange("bleConnectionStateCallBack");

  // 有设备连接后才会触发回调
  window.bleConnectionStateCallBack = (res) => {
    let data = d(res);
    console.log("蓝牙设备连接结果:", data.connected);

    if (data.connected) {
      statusLeft.innerHTML = "已连接";
      isConnect = true;
      loadingImg.style.visibility = "hidden";

      onBLECharacteristicValueChange(); // 监听低功耗蓝牙设备的特征值变化
      notifyBle(); // 信道建立
      devUpdate.style.opacity = 1;
    } else {
      isDiscover = false;
      isConnect = false;
      statusLeft.innerHTML = "未连接";
      reconnect.style.display = "flex";
      batteryInfo.style.display = "flex";
      loadingImg.style.visibility = "hidden";
      if (mainStatus.innerHTML != "更新成功") {
        mainStatus.innerHTML = "更新失败";
      }
      bottomButton.innerHTML = "知道了";
      devUpdate.style.opacity = 0.6;
    }
  };
}

// 3.获取当前设备的mac地址
function getCurrentRegisteredDevice() {
  window.hilink.getCurrentRegisteredDevice("currentRegisteredDeviceCallBack");

  window.currentRegisteredDeviceCallBack = (res) => {
    let data = d(res);
    deviceIdMac = data.deviceId;
    console.log("当前设备mac地址:", deviceIdMac);

    // 开始扫描
    onBluetoothDeviceFound();
  };
}

// 4.发现附近蓝牙设备（先监听，后发现）
function onBluetoothDeviceFound() {
  window.hilink.onBluetoothDeviceFound("bluetoothDeviceCallBack");
  window.bluetoothDeviceCallBack = (res) => {
    let data = d(res);
    statusLeft.innerHTML = "连接中";
    reconnect.style.display = "none";
    loadingImg.style.visibility = "visible";
    // console.log('附近设备的信息:',data);

    // 把被扫描到的蓝牙设备的mac地址与当前要建立连接设备的mac地址做对比，
    if (isIOS) {
      // ios mac地址需要硬件配合暴露出来,此例子是暴露在广播名的advertisData字段里面
      // 解析advertisData拿到mac地址
      let advertisData = data.advertisData;
      let mac = (function analysisMac(str) {
        str = str.replace(/ /g, "");
        str = str.slice(str.length - 13, str.length - 1).toLocaleUpperCase();
        let tmp1 = "";
        for (let i = 0; i < str.length; i += 2) {
          if (tmp1 !== "") tmp1 += " ";
          tmp1 += str[i] + str[i + 1];
        }
        let arr = tmp1.split(" ");
        arr.reverse();

        let tmp2 = "";
        arr.map((item) => {
          tmp2 += item + ":";
        });
        tmp2 = tmp2.slice(0, tmp2.length - 1);
        return tmp2;
      })(advertisData);

      console.log("ios：附近设备mac:", mac);
      if (mac === deviceIdMac) {
        window.hilink.stopBluetoothDevicesDiscovery(); // 停止扫描
        UUID_OR_Mac = data.deviceId;
        bleConnection(UUID_OR_Mac);
      }
    } else {
      console.log("安卓:附近设备的MAC:", data[0].deviceId);
      console.log("设备MAC:", deviceIdMac);
      if (data[0].deviceId == deviceIdMac) {
        isDiscover = true;
        window.hilink.stopBluetoothDevicesDiscovery();
        UUID_OR_Mac = data[0].deviceId;
        bleConnection(UUID_OR_Mac);
      }
    }
  };

  if (isDiscover) {
    window.hilink.stopBluetoothDevicesDiscovery();
  } else {
    // 注意:当短时间重复多次搜寻附近蓝牙设备时，安卓手机概率不执行搜寻操作。
    console.log("发现附近蓝牙设备,获取其MAC地址，进行匹配...");
    window.hilink.startBluetoothDevicesDiscovery([], false, 1); // 开始扫描
  }

  //连接12s以上，提示连接超时
  setTimeout(() => {
    if (!isConnect) {
      window.hilink.stopBluetoothDevicesDiscovery();
      statusLeft.innerHTML = "未连接";
      reconnect.style.display = "flex";
      batteryInfo.style.display = "none";
      loadingImg.style.visibility = "hidden";

      backgroundColor.style.display = "";
    }
  }, 20 * 1000);
}

// 5.使用mac地址去连接蓝牙设备
function bleConnection(mac) {
  console.log("匹配成功，开始尝试连接蓝牙设备...");
  if (isIOS) {
    window.hilink.createBLEConnection(mac);
  } else {
    window.hilink.createBleConnection(mac, 2); // 指定蓝牙连接方式
  }
}

// 通知低功耗蓝牙设备的特征值的值 ,返回0表示通知成功。
function notifyBle() {
  console.log("信道建立...");
  try {
    let i = 0;
    var timer = setInterval(() => {
      if (i < notifyUuids.length) {
        console.log(UUID_OR_Mac, notifyUuids[i].serviceUuid, notifyUuids[i].readCharacteristicUuid);
        var status = window.hilink.notifyBLECharacteristicValueChange(UUID_OR_Mac, notifyUuids[i].serviceUuid, notifyUuids[i].readCharacteristicUuid, true);
        console.log(notifyUuids[i].sid + " notify status" + status);
        if (status === 0) {
          i++;
        }
      } else {
        console.log("notify 成功");
        clearInterval(timer);

        //获取所有云台设置
        writeBLECharacteristicValue(commandGetSettings);
      }
    }, 100);
  } catch (error) {
    console.log("notifyBLECharacteristicValueChange error");
  }
}

// 3.对蓝牙设备发送数据
function writeBLECharacteristicValue(data) {
  if (window.hilink) {
    window.hilink.writeBLECharacteristicValue(
      UUID_OR_Mac,
      notifyUuids[0].serviceUuid,
      notifyUuids[0].writeCharacteristicUuid,
      data,
      "writeBLECharacteristicValueCallBack"
    );
    console.log("发送数据：", data);
    window.writeBLECharacteristicValueCallBack = (res) => {
      let data = dataChange(res);
    };
  }
}

// 蓝牙设备操控：
// 1.监听低功耗蓝牙设备的特征值变化（设备侧变化，app接收变化值）
function onBLECharacteristicValueChange() {
  window.hilink.onBLECharacteristicValueChange("CharacteristicChangeCallBack");
  window.CharacteristicChangeCallBack = (res) => {
    var recData = JSON.parse(res);
    onReceiveData(recData.data);
  };
}

function onReceiveData(data) {
  console.log("收到数据:", data);
  var d2 = data.substring(4, 6);

  switch (d2) {
    case "91": //电量
      var battery = data.substring(10, 12);
      batteryInfo.style.display = "flex";

      if (isDark) {
        switch (battery) {
          case "00":
            batteryNum.innerHTML = 20;
            batteryImg.src = "./img/dark/public/battery_0.png";
            break;

          case "01":
            batteryNum.innerHTML = 40;
            batteryImg.src = "./img/dark/public/battery_1.png";
            break;

          case "02":
            batteryNum.innerHTML = 60;
            batteryImg.src = "./img/dark/public/battery_2.png";
            break;

          case "03":
            batteryNum.innerHTML = 80;
            batteryImg.src = "./img/dark/public/battery_3.png";
            break;

          case "04":
            batteryNum.innerHTML = 100;
            batteryImg.src = "./img/dark/public/battery_4.png";
            break;
        }
      } else {
        switch (battery) {
          case "00":
            batteryNum.innerHTML = 20;
            batteryImg.src = "./img/light/public/battery_0.png";
            break;

          case "01":
            batteryNum.innerHTML = 40;
            batteryImg.src = "./img/light/public/battery_1.png";
            break;

          case "02":
            batteryNum.innerHTML = 60;
            batteryImg.src = "./img/light/public/battery_2.png";
            break;

          case "03":
            batteryNum.innerHTML = 80;
            batteryImg.src = "./img/light/public/battery_3.png";
            break;

          case "04":
            batteryNum.innerHTML = 100;
            batteryImg.src = "./img/light/public/battery_4.png";
            break;
        }
      }

      break;

    case "81":
      var param = data.substring(8, 10);

      if (param === "33") {
        var version1 = data.substring(10, 12);
        var version4 = data.substring(16, 18);

        var currentVersion = "V1." + hex2int(version1) + "." + hex2int(version4);

        firmwareVersion.innerHTML = currentVersion;
        versionNumber.innerHTML = currentVersion;
        mainVersion.innerHTML = currentVersion;

        var localVersionArray = currentVersion.split(".");
        localVersion1 = parseInt(localVersionArray[1]);
        localVersion4 = parseInt(localVersionArray[2]);

        // 检查更新
        checkUpdate();
      }
      break;

    case "A8":
    case "A9":
      switch (data.substring(16, 18)) {
        //请求固件信息
        case "30":
          if (typeof gimbalBin_1 == "undefined") {
            pageControl.style.display = "none";
            pageUpdate.style.display = "";
            devName.innerHTML = "固件更新";
            devMore.style.display = "none";

            checkUpdate();
          } else {
            //判断固件类型
            switch (data.substring(12, 14)) {
              case "59":
                sendFirmwareMessage(gimbalBin_1_st_302, d2, data.substring(12, 14));
                break;

              case "60":
                sendFirmwareMessage(gimbalBin_1_st, d2, data.substring(12, 14));
                break;

              case "61":
                sendFirmwareMessage(gimbalBin_1, d2, data.substring(12, 14));
                break;

              case "64":
                var size = gimbalBin_4.size();
                sendFirmwareMessage(gimbalBin_4, d2, data.substring(12, 14));
                break;
            }
          }

          break;

        //请求某一页数据
        case "31":
          if (window.requestPageNum) {
            sendGroupData(window.requestPageNum);
          } else {
            var requestPageNum = hex2int(data.substring(18, 22));
            sendGroupData(requestPageNum);
          }
          break;

        case "32":
          writeBLECharacteristicValue(commandShutterDown);
          mainStatus.innerHTML = "更新成功";
          bottomButton.innerHTML = "完成";
          break;

        case "33":
          mainStatus.innerHTML = "更新失败";
          bottomButton.innerHTML = "重试";
          break;
      }
      break;
  }
}

function sendGroupData(page) {
  mainStatus.innerHTML = "正在更新...";
  bottomButton.innerHTML = "取消";
  statusProgress.style.display = "";
  if (window.groupNum) {
    var percent = Math.floor(((page + 1) / window.groupNum) * 100);
  } else {
    var percent = Math.floor(((page + 1) / groupNum) * 100);
  }

  text1.innerHTML = percent;
  arrowTop.style.display = "none";
  mainVersion.style.marginTop = "0px";

  refreshProgress(percent, 2);

  var groupData = binData.substr(page * 1024 * 2, 1024 * 2);

  //开始发送
  for (var i = 0; i < 52; i++) {
    if (i < 51) {
      var sendData = groupData.substr(i * 20 * 2, 20 * 2);
      writeBLECharacteristicValue(sendData);
    } else {
      var endData = groupData.substr(1020 * 2, 8) + patch0(crc32(groupData).toString(16), 8);
      writeBLECharacteristicValue(endData);
    }
  }
}

function refreshProgress(percent, state) {
  window.renderProgress(percent, state);
}

//发送固件包数据
function sendFirmwareMessage(gimbalBin, device, mcu) {
  var url = gimbalBin.url();
  var name = gimbalBin.name();

  hilink.downloadFile(url, name, "resultCallback");
  window.resultCallback = (fileKey) => {
    var result = JSON.parse(fileKey);
    if (result.errCode == 0) {
      binData = hilink.getStorageSync(result.fileKey);

      //去掉首位各3个字节
      binData = binData.substr(6, binData.length - 12);

      var size = binData.length / 2;

      groupNum = Math.ceil(size / 1024);
      //多少组数据，占用两个字节
      var groupNumHex = patch0(groupNum.toString(16), 4);

      //不足1024部分填充满0xff
      if (size % 1024 != 0) {
        var offsetLength = 1024 - (size % 1024);
        var offsetData = "";
        for (var i = 0; i < offsetLength; i++) {
          offsetData += "FF";
        }
        binData = binData + offsetData;
      }

      //组装命令数据
      var commandFirst = "aaaa" + device + "0a00" + mcu + "65a530" + groupNumHex + patch0(crc32(binData).toString(16), 8);

      //添加校验
      var commandSecond = commandFirst + patch0(crc8(commandFirst, commandFirst.length).toString(16), 2);

      //发送固件数据
      writeBLECharacteristicValue(commandSecond);
    }
  };
}

function hex2int(hex) {
  var len = hex.length,
    a = new Array(len),
    code;
  for (var i = 0; i < len; i++) {
    code = hex.charCodeAt(i);
    if (48 <= code && code < 58) {
      code -= 48;
    } else {
      code = (code & 0xdf) - 65 + 10;
    }
    a[i] = code;
  }

  return a.reduce(function (acc, c) {
    acc = 16 * acc + c;
    return acc;
  }, 0);
}

function crc32(str) {
  var table =
    "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
  var crc = 0;
  var x = 0;
  var y = 0;
  crc = crc ^ -1;
  for (var i = 0, iTop = str.length; i < iTop; i = i + 2) {
    y = (crc ^ ("0x" + str.substring(i, i + 2))) & 0xff;
    x = "0x" + table.substr(y * 9, 8);
    crc = (crc >>> 8) ^ x;
  }
  return (crc ^ -1) >>> 0;
}

function crc8(data, length) {
  var widht = 8;
  var topbit = 1 << (widht - 1);
  var polynomial = 0x8d;
  var crc = 0;
  for (var i = 0; i < length; i = i + 2) {
    crc ^= ("0x" + data.substring(i, i + 2)) & 0xff;
    for (var j = 8; j > 0; --j) {
      if ((crc & topbit) !== 0) {
        crc = ((crc << 1) ^ polynomial) | 0;
      } else {
        crc = (crc << 1) | 0;
      }
    }
  }
  return crc & 0xff;
}

//16进制补0
function patch0(hex, len) {
  while (hex.length < len) hex = "0" + hex;
  return hex;
}

//固件更新相关
var statusProgress = document.getElementsByClassName("statusProgress")[0];
var text1 = document.getElementsByClassName("text1")[0];
var mainVersion = document.getElementsByClassName("mainVersion")[0];
var arrowTop = document.getElementsByClassName("arrowTop")[0];
var mainStatus = document.getElementsByClassName("mainStatus")[0];
var versionTitle = document.getElementsByClassName("versionTitle")[0];
var versionNumber = document.getElementsByClassName("versionNumber")[0];
var versionSize = document.getElementsByClassName("versionSize")[0];
var firmwarePoint2 = document.getElementsByClassName("firmwarePoint2")[0];

var bottomButton = document.getElementsByClassName("bottomButton")[0];
var barLeft = document.getElementsByClassName("barLeft")[0];

//底部按钮点击事件
bottomButton.addEventListener("click", function (event) {
  if (bottomButton.innerHTML == "开始更新") {
    if (remoteVersion1 > localVersion1) {
      writeBLECharacteristicValue(commandUpdate1);
    } else if (remoteVersion4 > localVersion4) {
      writeBLECharacteristicValue(commandUpdate4);
    }
    mainStatus.innerHTML = "正在更新...";
    bottomButton.innerHTML = "取消";
  } else if (bottomButton.innerHTML == "检查更新") {
    checkUpdate();
  } else if (bottomButton.innerHTML == "完成") {
    hilink.finishDeviceActivity();
  } else if (bottomButton.innerHTML == "取消") {
    hilink.finishDeviceActivity();
  } else if (bottomButton.innerHTML == "知道了") {
    hilink.finishDeviceActivity();
  }

  event.stopPropagation();
});

//服务器
var appId = "ltIyBvKwk9f757X7XyORVzXG-gzGzoHsz";
var appKey = "XLuziR5RM9oAEQpKL7WSEkX6";
var server = "https://ltiybvkw.lc-cn-n1-shared.com";

AV.init({
  appId: appId,
  appKey: appKey,
  serverURL: server,
});

function checkUpdate() {
  renderProgressScript();

  mainStatus.innerHTML = "正在检查...";
  bottomButton.innerHTML = "正在检查";
  versionSize.style.visibility = "hidden";
  statusProgress.style.display = "none";
  firmwarePoint2.style.visibility = "hidden";
  firmwarePoint.style.visibility = "hidden";

  const query = new AV.Query("VersionControl");

  query.limit(1);
  query.addDescending("createdAt");

  query.find().then((versionControls) => {
    // students 是包含满足条件的 Student 对象的数组
    remoteVersion1 = versionControls[0].get("gimbal_version_pi_1");
    remoteVersion4 = versionControls[0].get("gimbal_version_pi_4");

    gimbalBin_1 = versionControls[0].get("gimbal_bin_pi_1");
    gimbalBin_1_st = versionControls[0].get("gimbal_bin_pi_1_st");
    gimbalBin_1_st_302 = versionControls[0].get("gimbal_bin_pi_1_st_302");
    gimbalBin_4 = versionControls[0].get("gimbal_bin_pi_4");

    if (remoteVersion1 > localVersion1) {
      versionTitle.innerHTML = "新版本";
      versionNumber.innerHTML = "V1." + remoteVersion1 + "." + localVersion4;
      versionSize.style.visibility = "visible";
      versionSize.innerHTML = "大小：" + Math.ceil(gimbalBin_1.size() / 1024) + "k";
      firmwarePoint2.style.visibility = "visible";
      firmwarePoint2.style.left = 5.8 + "rem";
      firmwarePoint.style.visibility = "visible";
      mainStatus.innerHTML = "发现新版本";
      bottomButton.innerHTML = "开始更新";
    } else if (remoteVersion4 > localVersion4) {
      versionTitle.innerHTML = "新版本";
      versionNumber.innerHTML = "V1." + localVersion1 + "." + remoteVersion4;
      versionSize.style.visibility = "visible";
      versionSize.innerHTML = "大小：" + Math.ceil(gimbalBin_4.size() / 1024) + "k";
      firmwarePoint2.style.visibility = "visible";
      firmwarePoint2.style.left = 5.8 + "rem";
      firmwarePoint.style.visibility = "visible";
      mainStatus.innerHTML = "发现新版本";
      bottomButton.innerHTML = "开始更新";
    } else {
      versionTitle.innerHTML = "当前版本";
      versionNumber.innerHTML = "V1." + localVersion1 + "." + localVersion4;
      versionSize.style.visibility = "hidden";
      firmwarePoint2.style.visibility = "hidden";
      firmwarePoint.style.visibility = "hidden";
      mainStatus.innerHTML = "已是最新版";
      bottomButton.innerHTML = "检查更新";
    }
  });
}

var isDark = false;
// 暗黑模式适配
function setDarkMode() {
  try {
    isDark = window.hilink.getDarkMode() === 2;
  } catch (error) {}
  if (isDark) {
    this.document.getElementById("app").style.background = "#000000";
    this.document.getElementsByClassName("devName")[0].style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("devStatus")[0].style.background = "rgba(54,54,54,0.86)";
    this.document.getElementsByClassName("devFn")[0].style.background = "rgba(54,54,54,0.86)";
    statusLeft.style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("firmwareUpdate")[0].style.color = "rgba(255,255,255,0.86)";
    firmwareVersion.style.color = "rgba(255,255,255,0.66)";
    mainVersion.style.color = "rgba(255,255,255,0.86)";
    text1.style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("text2")[0].style.color = "rgba(255,255,255,0.86)";
    mainStatus.style.color = "rgba(255,255,255,0.86)";
    versionTitle.style.color = "rgba(255,255,255,0.86)";
    versionNumber.style.color = "rgba(255,255,255,0.66)";
    versionSize.style.color = "rgba(255,255,255,0.66)";
    reconnect.style.color = "rgba(52,145,255,1)";
    batteryNum.style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("batteryUnit")[0].style.color = "rgba(255,255,255,0.6)";
    bottomButton.style.color = "rgba(255,255,255,0.86)";
    bottomButton.style.background = "rgba(49,122,247,1)";

    this.document.getElementsByClassName("tipsWhite")[0].style.background = "rgba(54,54,54,1)";
    this.document.getElementsByClassName("devInfo")[0].style.background = "rgba(54,54,54,1)";
    this.document.getElementsByClassName("tipFont1")[0].style.color = "rgba(255,255,255,0.9)";
    this.document.getElementsByClassName("tipFont2")[0].style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("tipFont3")[0].style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("tipFont4")[0].style.color = "rgba(255,255,255,0.86)";
    this.document.getElementsByClassName("tipLater")[0].style.color = "rgba(52,145,255,1)";
    this.document.getElementsByClassName("centerLine")[0].style.color = "rgba(255,255,255,0.2)";
    this.document.getElementsByClassName("tipReconnect")[0].style.color = "rgba(52,145,255,1)";

    this.document.getElementsByClassName("goApp")[0].src = "./img/dark/public/ic_back.png";
    this.document.getElementsByClassName("devMore")[0].src = "./img/dark/public/ic_device_info.png";
    this.document.getElementsByClassName("updateImg")[0].src = "./img/dark/public/icon_update.png";
    loadingImg.src = "./img/dark/public/loading.gif";

    this.document.getElementsByClassName("white")[0].style.background = "rgba(0,0,0,1)";
    this.document.getElementsByClassName("blue")[0].style.borderColor = "rgba(0,0,0,1)";
    this.document.getElementsByClassName("myCircle")[0].style.stroke = "rgba(255,255,255,0.1)";
  }
}

setDarkMode();

const renderProgressScript = () => {
  const progressScript = document.createElement("script");
  progressScript.src = "./vue/src/dist/js/app.28e8c182.js";
  document.querySelector("body").appendChild(progressScript);
};

// TODO 以下注释是调试自动升级
const testAutoUpgrade = () => {
  setTimeout(() => {
    onReceiveData("----A9----------30");
  }, 500);

  window.groupNum = 100;
  window.requestPageNum = -1;

  setTimeout(() => {
    onReceiveData("----A9----------31");

    const tid = setInterval(() => {
      window.requestPageNum++;
      if (window.requestPageNum > 99) {
        window.requestPageNum = 99;
        clearInterval(tid);
      }
      onReceiveData("----A9----------31");
    }, 200);
  }, 1000);
};

testAutoUpgrade();
