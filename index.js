const setTextContent = (element, content) => {
  document.querySelector(element).textContent = content;
};

const setToday = (init) => {
  getCalendarYearMonth(init);
  getCalendarDate(init.getDate(), init.getDay());
};

let calculatedDate = 0;
let searchDate = new Date('yyyy-mm-dd');

const DateInit = {
  monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
  formatNumber: (num) => (num < 10 ? '0' + num : num),
  selectedDateTag: null,
  getIndex: function (node) {
    let index = 0;
    while ((node = node.previousElementSibling)) {
      index++;
    }
    return index;
  },
};

const $calendarBody = document.querySelector('.calendarBody');
const $btnNext = document.querySelector('.cal-buttonStyle.next');
const $btnPrev = document.querySelector('.cal-buttonStyle.prev');

const getCalendarDate = (date, day) => {
  setTextContent('.calendarDate', DateInit.today.getDate());
  setTextContent('.calendarDay', DateInit.dayNameList[DateInit.today.getDay()]);
};

const getCalendarYearMonth = (fullDate) => {
  let year = fullDate.getFullYear();
  let month = fullDate.getMonth();
  let startDay = DateInit.getstartDay(year, month);
  let endDay = DateInit.getendDay(year, month);
  let writeToday;
  console.log(fullDate);

  if (
    month === DateInit.today.getMonth() &&
    year === DateInit.today.getFullYear()
  ) {
    writeToday = DateInit.today.getDate();
  }

  document.querySelector('.calendarMonth').textContent =
    DateInit.monthList[month];
  document.querySelector('.calendarMonth-info').textContent =
    DateInit.today.getMonth() + 1 + '월';
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
        tableTag += '<td><span>';
      } else {
        let fullDate =
          year +
          '.' +
          DateInit.formatNumber(month + 1) +
          '.' +
          DateInit.formatNumber(dayCount + 1);

        tableTag += `<td> 
        <span onclick={dateClick(${dayCount + 1})}
        class="day`;

        tableTag +=
          writeToday && writeToday === dayCount + 1 ? ' today" ' : '"';
        tableTag += ` data-date="${dayCount + 1}" data-fdate="${fullDate}">`;
      }
      tableTag += startCount ? ++dayCount : '';
      if (dayCount === endDay.getDate()) {
        startCount = 0;
      }
      tableTag += '</span></td>';
    }
    tableTag += '</tr>';
  }
  $calendarBody.innerHTML = tableTag;
};

$btnNext.addEventListener('click', () =>
  getCalendarYearMonth(DateInit.nextMonth())
);
$btnPrev.addEventListener('click', () =>
  getCalendarYearMonth(DateInit.prevMonth())
);

$calendarBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('day')) {
    if (DateInit.selectedDateTag) {
      DateInit.selectedDateTag.classList.remove('day-active');
    }
    let day = Number(e.target.textContent);
    getCalendarDate(day, e.target.cellIndex);
    e.target.classList.add('day-active');
    DateInit.selectedDateTag = e.target;
    DateInit.activeDate.setDate(day);
  }

  searchDate = `${DateInit.activeDate.getFullYear()}-${
    DateInit.activeDate.getMonth() + 1
  }-${DateInit.formatNumber(DateInit.activeDate.getDate())}`;

  document.querySelector('.searchDate').value = searchDate;
  dateClick(DateInit.activeDate);
});
setToday(DateInit.today);

const searchDateClick = (e) => {
  const day = new Date(e);
  searchDate = `${day.getFullYear()}-${
    day.getMonth() + 1
  }-${DateInit.formatNumber(day.getDate())}`;

  DateInit.activeDate = new Date(searchDate);
  dateClick(DateInit.activeDate);
  getCalendarYearMonth(new Date(e));
};

const dateClick = (clickedDate) => {
  if (isNaN(clickedDate)) {
    alert("날짜를 선택해주세요.")
    return;
  }
  let end = new Date();
  let start = new Date();
  let beforeAfterString = '후';
  let todayDate = DateInit.today;

  if (clickedDate > todayDate) {
    start = new Date(
      `${todayDate.getFullYear()}-${
        todayDate.getMonth() + 1
      }-${todayDate.getDate()}`);
    end = new Date(
      `${DateInit.activeDate.getFullYear()}-${
        DateInit.activeDate.getMonth() + 1
      }-${DateInit.activeDate.getDate()}`
    );
  } else {
    start = new Date(
      `${DateInit.activeDate.getFullYear()}-${
        DateInit.activeDate.getMonth() + 1
      }-${DateInit.activeDate.getDate()}`);
    end = new Date(
      `${todayDate.getFullYear()}-${
        todayDate.getMonth() + 1
      }-${todayDate.getDate()}`
    );
    beforeAfterString = '전';
  }

  while (end > start) {
    calculatedDate++;
    start.setDate(start.getDate() + 1);
  }

  setTextContent(
    '#selected-date',
    `${DateInit.activeDate.getFullYear()}년 ${
      DateInit.activeDate.getMonth() + 1
    }월 ${DateInit.activeDate.getDate()}일은`
  );
  setTextContent(
    '#calculated-date',
    calculatedDate + '일 ' + beforeAfterString + ' 입니다.'
  );
  calculatedDate = 0;
};
