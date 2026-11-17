/* 문파 전투 일정 — 요일(0=일 … 6=토), 시각은 한국 시간 기준
   일정이 바뀌면 여기만 고치면 메인·문파 전투 페이지가 같이 바뀌어요.
   live: 시작 후 '진행 중'으로 보여 줄 시간(분), apply: 신청 마감 시각 */
window.BATTLES = [
  { id: "yoshin",   no: 1, name: "요신 토벌령", kind: "deadline", dow: 2, h: 20, m: 0 },
  { id: "barrier",  no: 2, name: "결계지 방어", kind: "deadline", dow: 2, h: 20, m: 0 },
  { id: "garden",   no: 3, name: "미혹의 정원", kind: "start",    dow: 6, h: 20, m: 0, live: 30, apply: { dow: 6, h: 8, m: 0 } },
  { id: "artifact", no: 4, name: "신기 쟁탈전", kind: "start",    dow: 5, h: 20, m: 0, live: 30, apply: { dow: 5, h: 8, m: 0 } }
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
  /* 시작 후 live분 안이면 진행 중 */
  function isLive(b, now) {
    if (!b.live) return false;
    var since = 7 * DAY - untilNext(b, now);           // 지난 시작 시각부터 흐른 시간
    return since >= 0 && since < b.live * 60000;
  }
  function fmt(ms) {
    var s = Math.floor(ms / 1000), d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return { d: d, text: (d ? d + "일 " : "") + p(h) + ":" + p(m) + ":" + p(x) };
  }
  window.BattleTime = {
    untilNext: untilNext,
    isLive: isLive,
    fmt: fmt,
    /* 진행 중인 전투가 있으면 그것, 없으면 가장 가까운 일정 */
    soonest: function (now) {
      var best = null;
      window.BATTLES.forEach(function (b) {
        if (isLive(b, now)) { best = { b: b, ms: 0, live: true }; return; }
        if (best && best.live) return;
        var ms = untilNext(b, now);
        if (!best || ms < best.ms) best = { b: b, ms: ms };
      });
      return best;
    }
  };
})();
