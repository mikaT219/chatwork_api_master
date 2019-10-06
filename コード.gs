function getMessage() {

  //取得するチャットルームのIDを設定
  var roomID = "156248553";

  // APIトークンを設定
  var apiToken = "3f3cdc86a0e2a18b772925da35eebe96";

  // api url
  var url = "https://api.chatwork.com/v2/rooms/" + roomID + "/messages?force=1";
  //force=0　追加メッセージ取得
  //force=1　全メッセージ取得　  

  // apiに渡すパラメータを設定
  var params = {
    headers : {"X-ChatWorkToken" : apiToken},
    method : "GET"
  };

  // 実行
  var res = UrlFetchApp.fetch(url, params);

  // 結果が存在した場合、json形式で取得した結果をparseする
  if (res != "") {
    var dataArr = JSON.parse(res.getContentText()); 
    
    //月を確認する    
    var Month = String(Utilities.formatDate(new Date(), "JST", "yyyyMM"));
    Logger.log('Month:' + Month);

    //日付を確認する    
    var date = String(Utilities.formatDate(new Date(), "JST", "yyyyMMdd"));
    Logger.log('date:' + date);

    //書き込むスプレッドシートを保存するディレクトリ作成
    var folder = DriveApp.getFolderById("1TIcb5rWED1Uo8zJFvN2E8PrY6Teh9gXU"); 
    // コピ―したファイルを保存するフォルダIDを取得＆入力    
    var file=folder.getFilesByName(Month).next();
    SpreadsheetApp.openById(file.getId());
    Logger.log('file.getId():' + file.getId());
    
    var ss = SpreadsheetApp.openById(file.getId());
    
    //シート数を取得する
    var num = ss.getNumSheets();
    Logger.log("num:"+num);
    var ssname = ss.getSheetName(); 
    Logger.log("ssname:"+ssname);

    //一番右のシートをアクティブ化する
    var num =num-1
    Logger.log("num:"+num);
    ss.setActiveSheet(ss.getSheets()[num]); 
    
    //アクティブなシート名を取得する 
    var ssname = ss.getSheetName(); 
    
    //日付を比較して日付が異なればシート追加かつインデックス追記
    if (date != ssname) {    
      ss.insertSheet();
      ss.renameActiveSheet(date);

      // ハイパーリンクをインデックスシートに追記／https://qiita.com/okNirvy/items/d1a2f4918cff8e63dcac
      var sheets =  ss.getSheets();
      var ssId = ss.getId();
      
      // ハイパーリンク文字列の配列
      var linkList = [[]];
      
      for(var i=0; i<sheets.length; i++) {
        // シートのIDと名前
        var sheetId = sheets[i].getSheetId();
        var sheetName = sheets[i].getSheetName();
        
        // シートのURLからハイパーリンク文字列を組み立て
        var url = "https://docs.google.com/spreadsheets/d/" + ssId + "/edit#gid=" + sheetId;
        var link = [ '=HYPERLINK("' + url + '","' + sheetName + '")' ];
        
        // ハイパーリンク文字列を配列に格納
        linkList[i] = link;
      }
      
      //インデックスシートに追記
      var sheet = ss.getSheetByName("Index")      
      var cell = sheet.getActiveCell();
      var range = sheet.getRange(cell.getRow() , cell.getColumn() ,  linkList.length , 1);
      range.setValues(linkList);
    }    
    
    //取得したログを該当する日付のスプレッドシートに出力する
    for each(var data in dataArr) {
      var d = new Date( data.send_time * 1000 );
      var year  = d.getFullYear();
      var month = d.getMonth() + 1;
      var day  = d.getDate();
      var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
      var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
      var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
      var send_time = ( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
      ss.appendRow([send_time,data.account.name,data.body]);             
    }    
  }
}

//大量シートを消す
function deletesheet() {
   var cnt = ss.getNumSheets(); //アクティブなスプレッドシートのシート数を取得
   Logger.log(cnt);
   var sheet = ss.getSheetByName('Index'); //残したいシートが存在するスプレッドシートを定義
   SpreadsheetApp.setActiveSheet(sheet); //指定したシート名をアクティブシートにする
   
  　for(var i = cnt;　i >= 2; i--){ 
     //初期値の変数iはシート数を表す変数cnt、iをｰ1していき2以上の間は処理を繰り返し
     var sh = ss.getSheets()[i-1];　//アクティブなスプレッドシートに存在するシートを、[i-1]により配列の要素数で指定して取得し、変数shに代入
     Logger.log(sh);     
     ss.deleteSheet(sh); //シート削除　
   } 
 }

