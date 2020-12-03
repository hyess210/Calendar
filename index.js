const DateInit = {
  monthList: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNameList: ['SUN', '월', '화', '수', '목', '금', '토'],
  today: new Date(),
  monForChange: new Date().getMonth(),
  activeDate: new Date(),
  getstartDay: (year, month) => new Date(year, month, 1),
  getendDay: (year, month) => new Date(year, month + 1, 0),
  nextMonth: function () {
    let d = new Date();
    d.setDate(1);
    d.setMonth(++this.monForChange);
    this.activeDate = d;
    return d;
  },
  prevMonth: function () {
    let d = new Date();
    d.setDate(1);
    d.setMonth(--this.monForChange);
    this.activeDate = d;
    return d;
  },
  addZero: (num) => (num < 10 ? '0' + num : num),
  activeDTag: null,
  getIndex: function (node) {
    let index = 0;
    while ((node = node.previousElementSibling)) {
      index++;
    }
    return index;
  }
};


const $calendarBody = document.querySelector('.calendarBody');
const $btnNext = document.querySelector('.cal-buttonStyle.next');
const $btnPrev = document.querySelector('.cal-buttonStyle.prev');

const getCalendarDate = (date, day) => {
    document.querySelector('.calendarDate').textContent = date;
    document.querySelector('.calendarDay').textContent = 
    DateInit.dayNameList[day];
}

const getCalendarYearMonth = (fullDate) => {
  let year = fullDate.getFullYear();
  let month = fullDate.getMonth();
  let startDay = DateInit.getstartDay(year, month);
  let endDay = DateInit.getendDay(year, month);
  let writeToday;

  if (
    month === DateInit.today.getMonth() &&
    year === DateInit.today.getFullYear()
  ) {
    writeToday = DateInit.today.getDate();
  }

  document.querySelector('.calendarMonth').textContent =
    DateInit.monthList[month];
  document.querySelector('.calendarYear').textContent = year;

  let tableTag = '';
  let startCount;
  let dayCount = 0;

  for (let i = 0; i < 6; i++) {
    tableTag += '<tr>';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && !startCount && j === startDay.getDay()) {
        startCount = 1;
      }
      if (!startCount) {
        tableTag += '<td>';
      } else {
        let fullDate =
          year +
          '.' +
          DateInit.addZero(month + 1) +
          '.' +
          DateInit.addZero(dayCount + 1);
        tableTag += '<td class="day';
        tableTag +=
          writeToday && writeToday === dayCount + 1 ? ' today" ' : '"';
        tableTag += ` data-date="${dayCount + 1}" data-fdate="${fullDate}">`;
      }
      tableTag += startCount ? ++dayCount : '';
      if (dayCount === endDay.getDate()) {
        startCount = 0;
      }
      tableTag += '</td>';
    }
    tableTag += '</tr>';
  }
  $calendarBody.innerHTML = tableTag;
};

$calendarBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
      if (DateInit.activeDTag) {
        DateInit.activeDTag.classList.remove('day-active');
      }
      let day = Number(e.target.textContent);
      getCalendarDate(day, e.target.cellIndex);
      e.target.classList.add('day-active');
      DateInit.activeDTag = e.target;
      DateInit.activeDate.setDate(day);
      reloadTodo();
    }
  });

getCalendarYearMonth(DateInit.today);
getCalendarDate(DateInit.today.getDate(), DateInit.today.getDay());
