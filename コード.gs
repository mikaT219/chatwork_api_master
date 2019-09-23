function myFunction() {  
  
  //年月を取得する
  var Month = String(Utilities.formatDate(new Date(), "JST", "yyyyMM"));
  Logger.log("Month:"　+　Month);
  
　//アクティブファイルの名前を取得する
  var ss = SpreadsheetApp.getActiveSpreadsheet();
　ss.getName();
  Logger.log("ss.getName:"　+　ss.getName());

  // 年月とアクティブシート名が同じならログ取得を行う
  if (Month = ss.getName) {
  　　ChatworkAPI.getMessage();
     Logger.log("Fin");
  }

}  