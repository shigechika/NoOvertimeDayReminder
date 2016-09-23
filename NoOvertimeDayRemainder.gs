function noOvertimeDayRemainder() {
  var today = new Date();
  
  if (isNoOvertimeDay(today)) {
    Logger.log("残業NG");
    var week = [ "日", "月", "火", "水", "木", "金", "土" ];

    MailApp.sendEmail(
      'all@example.jp', // 管財部
      'No残業Dayのお知らせ',
      '皆様，' + (today.getMonth() + 1) + '月' + today.getDate() + '日（'　+ week[ today.getDay() ] + '）はNo残業Dayです。\n定時になったら速やかに退勤しましょう！\n-- No残業Dayリマインダー\n※ 本メールは送信専用メールアドレスから送っています。返信いただいてもお答えできませんのでご了承ください。',
      { noReply: true });
  } else {
    Logger.log("残業OK");
  }
}

function isNoOvertimeDay(target) {
  function getDayAndCount(date) {
    return {day: date.getDay(), count: Math.floor((date.getDate() - 1) / 7) + 1};
  }
  var counted_day = getDayAndCount(target);
  // [日, 月, 火, 水, 木, 金, 土]の順に第何番目がNo残業Dayを設定。-1は毎週No残業Day。
  // 毎週水曜と第4金曜日をNo残業Dayと設定
  var noOvertimeDays = [[null], [null], [null], [-1], [null], [4], [null]];

  var re;
  if (isJapaneseHoliday( target )) {
    Logger.log("祝日");
    re = false;
  } else if (isVacation(target)) {
    Logger.log("休暇");
    re = false;
  } else if　(noOvertimeDays[counted_day.day][0] == -1)　{
    // 毎週◯曜日
    re = true;
  }　else if　(noOvertimeDays[counted_day.day].indexOf(counted_day.count) != -1)　{
    // 第N週△曜日
    re = true; 
  } else {
    re = false; 
  }
  
  Logger.log( "isNoOvertimeDay => " + re );
  return re
}

function isJapaneseHoliday( target ) {
  // 祝日チェック
  var cal = CalendarApp.getCalendarById("ja.japanese#holiday@group.v.calendar.google.com");
  var events = cal.getEventsForDay(target);
  return events.length != 0;
}

function isVacation( target ) {
  // 休暇チェック
  target.setHours(0, 0, 0, 0); // 日付の比較に時刻不要なのでゼロリセット
  var vacation = [
    [ "2016/08/12", "2016/08/17" ], // 夏休み
    [ "2016/10/04" ], 		    // 創立記念日
    [ "2016/12/29", "2017/01/07" ], // 冬休み
//  [ "2016/09/23" ],		    // test
//  [ "2016/09/22", "2016/09/24" ], // test
  　　];
  Logger.log("vacation.length:" + vacation.length);
  Logger.log("target:" + target);
  for (var i = 0; i < vacation.length; i++) {
    if (vacation[i].length == 1)　{
      var day = new Date( vacation[i][0] );
      Logger.log("single:" + target);
      if (target.getTime() == day.getTime()) {
        Logger.log("Bingo!");
        return true;
      }
    } else { 
      var start = new Date(vacation[i][0]);
      var end = new Date(vacation[i][1]);
      Logger.log("start:" + start);
      Logger.log("end:" + end);
      if (target.getTime() >= start.getTime() && target.getTime() <= end.getTime()) {
        Logger.log("Bingo!");
        return true;
      }
    }
  }
  return false;
}
  
function　debug() {
  var today = new Date();
  
  isNoOvertimeDay(today);
}
