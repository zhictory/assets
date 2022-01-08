
// app接收数据的处理
function dataChange(res){
    let data = undefined;
    let dataStr = res;
    dataStr = dataStr.replace(/"{/g, '{');
    dataStr = dataStr.replace(/}"/g, '}');
    dataStr = dataStr.replace(/\\|\n|\r|\t|\f|\t/g, '');
    data = JSON.parse(dataStr);
    return data;
}

//// 获取手机状态栏高度
//function getStatusBarHeight(){
//    if(window.hilink){
//        hilink.getStatusBarHeight('BarHeightRes');
//    }
//    window.BarHeightRes = (res) => {
//        let data = dataChange(res).statusBarHeight;
//        console.log('手机状态栏高度:',window.screen.width);
//        console.log('手机状态栏高度:',window.screen.height);
//        console.log('手机状态栏高度:',window.devicePixelRatio);
//        setStatusBarHeight(data);
//    }
//}
//
//// 设定状态栏高度
//var iphoneStatus = document.getElementsByClassName("iphoneStatus")[0];
//var devTop = document.getElementsByClassName("devTop")[0];
//function setStatusBarHeight(num){
//    iphoneStatus.style.height = num + 'px';
//    devTop.style.height = (56 + num) + 'px';
//}
//getStatusBarHeight();

if(window.hilink)
   hilink.setTitleVisible(false);

//   alert(window.screen.height + "," + window.devicePixelRatio);




