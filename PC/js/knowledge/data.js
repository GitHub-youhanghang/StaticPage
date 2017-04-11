  var wsCache = new WebStorageCache();

  var data = [{ firstTitle: "前端", firstCon: [{ secondTitle: "js", secondCon: [{ thirdTitle: "baidu", href: "https://www.baidu.com" }] }, { secondTitle: "js", secondCon: [{ thirdTitle: "baidu", href: "https://www.baidu.com" }] }, { secondTitle: "js", secondCon: [{ thirdTitle: "baidu", href: "https://www.baidu.com" }] }] }, { firstTitle: "电脑", firstCon: [{ secondTitle: "111", secondCon: [{ thirdTitle: "baidu1", href: "https://www.baidu.com" }, { thirdTitle: "baidu2", href: "https://www.baidu.com" }] }, { secondTitle: "222", secondCon: [{ thirdTitle: "baidu2", href: "https://www.baidu.com" }] }] }];


  if (!wsCache.get('data')){
  wsCache.set('data', data);
  }

  //很重要，要自己备份书签内容
  console.log('定期存储书签内容，复制此内容保存起来，以防localstorage信息消失，彻底失去数据');
  console.log(obj2string(wsCache.get('data')));

  //添加数据


  var app = angular.module('myApp', []);

  app.controller('myCtrl', function($scope) {

      $scope.data = wsCache.get('data');

  });


  function obj2string(o) {
      var r = [];
      if (typeof o == "string") {
          return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
      }
      if (typeof o == "object") {
          if (!o.sort) {
              for (var i in o) {
                  r.push(i + ":" + obj2string(o[i]));
              }
              if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                  r.push("toString:" + o.toString.toString());
              }
              r = "{" + r.join() + "}";
          } else {
              for (var i = 0; i < o.length; i++) {
                  r.push(obj2string(o[i]))
              }
              r = "[" + r.join() + "]";
          }
          return r;
      }
      return o.toString();
  }
