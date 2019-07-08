import flatpickr from "flatpickr";

const now = new Date();
const today = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();

let activityEDT_fp = flatpickr("#activity-end-datetime", {
  enableTime: true,
  dateFormat: "Y/m/d H:i",
  time_24hr: true,
});

let activitySDT_fp = flatpickr("#activity-start-datetime", {
  enableTime: true,
  dateFormat: "Y/m/d H:i",
  time_24hr: true,
  minDate: today,
  onChange: function(dateObj, dateStr) {
    console.info(dateObj);
    console.info(dateStr);
  },
  onClose: function(selectedDates, dateStr, instance) {
    const maxDate = dateStr.split(' ')[0] + (dateStr.length > 0?' 23:59:59':dateStr);

    activityEDT_fp.set('minDate', dateStr);
    activityEDT_fp.set('maxDate', maxDate);
  },
});

window.onload = function () {
  const queryParams = new URL(window.location.href).searchParams;
  const isInternal = queryParams.get('internal');

  document.getElementById("submit-btn").innerHTML = ((isInternal === ""  || isInternal === "true")?"送出 (內部)":"送出");
}
