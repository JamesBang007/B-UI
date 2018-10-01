function rem(){
  var html = document.documentElement;
  var hWidth = html.getBoundingClientRect().width;
  hWidth = hWidth>750 ? 750 : hWidth ;
  html.style.fontSize = hWidth/15 + "px";
}
(function(){
  rem();
})();
window.onresize = rem;

var base = ''; //api测试接口
var base_h5 = '' //H5测试域名

var wxAppID = 'wx3f661bd3c1e2df49' //微信公众号测试AppID
