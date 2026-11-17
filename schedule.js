/* 문파 전투 일정 — 요일(0=일 … 6=토), 시각은 한국 시간 기준
   일정이 바뀌면 여기만 고치면 메인·문파 전투 페이지가 같이 바뀌어요. */
window.BATTLES = [
  { id: "yoshin",   no: 1, name: "요신 토벌령", kind: "deadline", dow: 2, h: 20, m: 0, when: "수시 오픈 · 주간 마감 화 20:00", pts: "직접 10점 · 분신 5점" },
  { id: "barrier",  no: 2, name: "결계지 방어", kind: "deadline", dow: 2, h: 20, m: 0, when: "수시 오픈 · 주간 마감 화 20:00", pts: "직접 10점 · 분신 5점" },
  { id: "garden",   no: 3, name: "미혹의 정원", kind: "start",    dow: 6, h: 20, m: 0, when: "매주 토요일 20:00", pts: "20점" },
  { id: "artifact", no: 4, name: "신기 쟁탈전", kind: "start",    dow: 5, h: 20, m: 0, when: "매주 금요일 20:00", pts: "20점" }
];

(function () {
  var KST = 9 * 3600 * 1000, DAY = 86400000;
  /* 다음 해당 요일·시각까지 남은 ms (한국 시간 기준) */
  function untilNext(b, now) {
    var k = new Date(now + KST);                       // UTC 게터로 읽으면 한국 시각
    var t = Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate(), b.h, b.m) - KST;
    t += ((b.dow - k.getUTCDay() + 7) % 7) * DAY;
    if (t <= now) t += 7 * DAY;
    return t - now;
  }
  function fmt(ms) {
    var s = Math.floor(ms / 1000), d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return { d: d, text: (d ? d + "일 " : "") + p(h) + ":" + p(m) + ":" + p(x), hms: p(h) + ":" + p(m) + ":" + p(x) };
  }
  window.BattleTime = {
    untilNext: untilNext,
    fmt: fmt,
    /* 가장 가까운 일정 하나 */
    soonest: function (now) {
      var best = null;
      window.BATTLES.forEach(function (b) {
        var ms = untilNext(b, now);
        if (!best || ms < best.ms) best = { b: b, ms: ms };
      });
      return best;
    }
  };
})();
