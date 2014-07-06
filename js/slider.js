$(function(){
  $("#month").slider({
    from: 1,
    to: 12,
    step: 1,
    scale:[1,2,3,4,5,6,7,8,9,10,11,12],
    round: 0,
    dimension: '月',
    onstatechange: function (value){
      changeMonth(value);
    }
  });
});
$(function(){
  $("#day").slider({
    from: 1,
    to: 31,
    step: 1,
    scale:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    round: 0,
    dimension: '日',
    onstatechange: function (value){
      changeDay(value);
    }
  });
});