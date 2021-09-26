

var feerule = $('#feerule'), //计费规则
  choiceTime = $('#choiceTime'),//时段选择
  videoTutorial = $('.video_tutorial'), //打开视频
  videoCont = $('.video_cont'), //视频容器
  closeVideo = $('.close_video'), //关闭视频
  lockNum = $('#lockNum .num'), //车位锁
  berthNum = $('#berthNum .num'), //泊位号
  numBox = $('.numbox'), //抬起键盘
  clean = $('.clean'),//删除数字
  keyBoard = $('#keyboard'), //
  keyunm = $('.keyunm'), //键盘
  advancePayment = $('.advancePayment'),//扫码缴费
  lockfail = $('.lockfail'),//开锁失败
  duration = $('.duration');//停车时长



/*********** 模拟url参数使用 start ************/
// 在页面链接中加入参数，模拟扫一扫结果，生产环境删除
function changeURLPar (uri, par, par_value) {
  var pattern = par + '=([^&]*)';
  var replaceText = par + '=' + par_value;
  if (uri.match(pattern)) {//如果连接中带这个参数
    var tmp = '/\\' + par + '=[^&]*/';
    tmp = uri.replace(eval(tmp), replaceText);
    return (tmp);
  }
  else {
    if (uri.match('[\?]')) {//如果链接中不带这个参数但是有其他参数
      return uri + '&' + replaceText;
    }
    else {//如果链接中没有带任何参数
      return uri + '?' + replaceText;
    }
  }
  return uri + '\n' + par + '\n' + par_value;
}
var uid = 12345678;
var newurl = changeURLPar(window.location.href, 'uid', uid)
window.history.pushState(null, null, newurl);

/*********** 模拟url参数使用 end ************/

// 常规参数
var appVersion = 'jstc.v1.2.0', // jstc.v1.2.0 lytc.v1.0.0
  reqId = new Date().getTime(),
  dataUrl = 'http://pay.zhchangnan.com/jst-pak-app/',
  parkId = "CNLN20210701";


// 截取url上的参数
function getQueryVariable (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

// 初始化mui
mui.init();

// 弹窗调用  使用mui的消息对话框，修改样式需修改mui.css
function tipspopup (msg) {
  mui.toast(msg);
}
// 选择预购时长
var picker = new mui.PopPicker({
  layer: 2,
});
picker.setData([{
  value: '1001',
  text: '1小时',
  children: [{
    value: "10011",
    text: "0分钟"
  }, {
    value: "10012",
    text: "30分钟"
  }]
}, {
  value: '1002',
  text: '2小时',
  children: [{
    value: "10021",
    text: "0分钟"
  }, {
    value: "10022",
    text: "30分钟"
  }]
},
{
  value: '1003',
  text: '3小时',
  children: [{
    value: "10031",
    text: "0分钟"
  }, {
    value: "10032",
    text: "30分钟"
  }]
},
{
  value: '1004',
  text: '4小时',
  children: [{
    value: "10031",
    text: "0分钟"
  }, {
    value: "10032",
    text: "30分钟"
  }]
},
{
  value: '1005',
  text: '5小时',
  children: [{
    value: "10051",
    text: "0分钟"
  }, {
    value: "10052",
    text: "30分钟"
  }]
},
{
  value: '1006',
  text: '6小时',
  children: [{
    value: "10061",
    text: "0分钟"
  }, {
    value: "10062",
    text: "30分钟"
  }]
},
{
  value: '1007',
  text: '7小时',
  children: [{
    value: "10071",
    text: "0分钟"
  }, {
    value: "10072",
    text: "30分钟"
  }]
}, {
  value: '1008',
  text: '8小时',
  children: [{
    value: "10081",
    text: "0分钟"
  }, {
    value: "10082",
    text: "30分钟"
  }]
},
{
  value: '1009',
  text: '2小时',
  children: [{
    value: "10091",
    text: "0分钟"
  }, {
    value: "10092",
    text: "30分钟"
  }]
},
{
  value: '10010',
  text: '10小时',
  children: [{
    value: "100101",
    text: "0分钟"
  }, {
    value: "100102",
    text: "30分钟"
  }]
},
{
  value: '10011',
  text: '2小时',
  children: [{
    value: "100111",
    text: "0分钟"
  }, {
    value: "100112",
    text: "30分钟"
  }]
},
{
  value: '10012',
  text: '12小时',
  children: [{
    value: "100121",
    text: "0分钟"
  }, {
    value: "100122",
    text: "30分钟"
  }]
}]);

choiceTime.click(function () {
  picker.pickers[0].setSelectedIndex(1);
  picker.pickers[1].setSelectedIndex(0);
  picker.show(function (selectItems) {
    var timeH = selectItems[0].text;
    var timeM = selectItems[1].text;
    var modle = '<p>' + timeH + timeM + '</p>'
    choiceTime.html(modle)
    console.log(timeH, timeM)
  })
})

// 使用视频
videoTutorial.click(function () {
  videoCont.css('display', 'flex')
})
closeVideo.click(function () {
  videoCont.hide()
})

/**
 车锁号获取 1.扫码获取 2.手动输入
 *
 *****/

//  扫码获取
!function lock () {
  // 参数应该是被拼接在url，这里截下来输出
  // 扫码获取的无论车锁号是几位都直接请求一次
  var lockid = getQueryVariable('uid').toString();
  for (var i = 0; i < lockid.length; i++) {
    lockNum.eq(i).text(lockid[i]).next().addClass('act_write').siblings().removeClass('act_write')
  }
  // 调用API 
  lockNumlen(lockid)
}()


// 抬起键盘
numBox.click(function (e) {
  e.stopPropagation(); //阻止冒泡
  if ($(this).hasClass('A_NUM')) {
    keyBoard.toggleClass('act');
    if (!$(this).children().hasClass('act_write')) {
      $(this).children(':first').addClass('act_write')
    }
  }
})

// 点击空白处关闭键盘
$(document).click(function (e) {
  if (!keyBoard.is(e.target) && keyBoard.has(e.target).length === 0) {
    keyBoard.removeClass('act');
    clean.removeClass('A_NUM B_NUM')
  }
});

// 清除
clean.click(function () {
  var z;
  if (numBox.hasClass('A_NUM')) {
    let lcok_num = lockNum.text();
    lockNum.each(function (i) {
      if (lockNum.hasClass('act_write')) {
        z = i
      }
    })
    if (z == 9 && $('#lockNum .act_write').text() != '') {
      $('#lockNum .act_write').text('')
    } else {
      $('#lockNum .act_write').prev().text('').addClass('act_write').siblings().removeClass('act_write')
    }
  }
});

// 调用API
function lockNumlen (lcoknum) {
  var len = Number(lcoknum.length);
  // 在此调用API，查询泊位号、停车时长
  // $.ajax({})
  var berthid = 1234567;//假设查询到的泊位号
  var time_len = '3小时11分钟34秒'                  //已停时长
  berth(berthid, time_len)
}

// 获取输入车锁号
keyunm.click(function () {
  var num = $(this).text();
  if (numBox.hasClass('A_NUM')) {
    if (lockNum.hasClass('act_write')) {
      $('#lockNum .act_write').text(num).next().addClass('act_write').siblings().removeClass('act_write')
      let lcok_num = lockNum.text();
      console.log(lcok_num)
      // 输满10位自动请求一次
      if (lcok_num.length == 10) (
        lockNumlen(lcok_num)
      )
    }
  }
})
// 七位泊位号、停车时长输出
function berth (berthnum, time_len) {
  thisnum = berthnum.toString();
  // 泊位号
  berthNum.each(function (i) {
    berthNum.eq(i).text(thisnum[i])
  })
  // 停车时长  根据后台返回的格式处理成可使用数据
  $('.duration').show();
  $('.duration span').text(time_len)
}

// 按钮控制  根据查询状态来显示  如果车位存在，显示[付费开锁] 不存在 显示[查询车位]

/******   假设支付成功  后台返回对应状态n
  n=0 --> 开锁中  
  n=1 -->  设备离线
  n=2 -->  开锁成功
  n=3 -->  锁超时未响应降锁
 ****/
function lockstatus () {
  var n = 0;
  switch (n) {
    case 0:
      tipspopup('开锁中，请等待！')
      break;
    case 1:
      tipspopup('网络走丢了，请重试')
      break;
    case 2:
      tipspopup('开锁成功，请驶离')
      break;
    case 3:
      tipspopup('车位锁未响应，请重试')
      break;
  }
}

// 付费开锁
advancePayment.on('click', function () {
  // 点击付款开锁需再次查询泊位号和停车时长
  //调用支付接口 支付成功：调用lockstatus()给出相应提示   支付失败：调用tipspopup（）
  var price = Number($('#payprice').text()).toFixed(2);
  console.log(price)
})
//预购时长
$('.preorder').on('click', function () {
  var time = $('#choiceTime').find('p').text();
  if (time != '') {
    console.log(time)
    // 时间格式处理
  } else {
    tipspopup('请选择预购时长')
  }
})

// 开锁失败
lockfail.click(function () {
  $('.popup_bg').show()
})
$('.closepop').click(function () {
  $('.popup_bg').toggle()
})

var gallery = mui('.mui-slider');
gallery.slider({
  interval: 5000
});
document.querySelector('.mui-slider').addEventListener('slide', function (event) {
  //注意slideNumber是从0开始的
  var itemid = event.detail.slideNumber + 1
  $('.mui-indicator').eq(itemid).addClass('mui-active').siblings().removeClass('mui-active')
});

