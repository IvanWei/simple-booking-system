import axios from "axios";
import swal2 from "sweetalert2";

const activitySDT_El = document.getElementById("activity-start-datetime");
const activityEDT_El = document.getElementById("activity-end-datetime");

let form = document.getElementById('form');
form.onsubmit = function(evt) {
  evt.preventDefault();

  const flashMsg = document.getElementById("flash-message");
  const loadingEl = document.getElementById("loading");
  const submitBtn = document.getElementById("submit-btn");
  const queryParams = new URL(window.location.href).searchParams;

  const activityNameEl = document.getElementById('activity-name');
  const participantsEl = document.getElementById('participants');
  const rentNameEl = document.getElementById('rent-name');
  const rentContactEl = document.getElementById('rent-contact');

  flashMsg.style.display = "none";

  if (activitySDT_El.value.length < 1 || activityEDT_El.value.length < 1) {
    flashMsg.style.display = "block";
    return false;
  }

  const isInternal = queryParams.get('internal');

  const params = {
    activityName: activityNameEl.value,
    participants: participantsEl.value,
    rentName: rentNameEl.value,
    rentContact: rentContactEl.value,
    activitySDT: activitySDT_El.value,
    activityEDT: activityEDT_El.value,
    isInternal: (isInternal === ""  || isInternal === "true"),
  };

  let swal2HtmlContent = `<div>活動名稱：${params.activityName}</div>`;
  swal2HtmlContent += `<div>活動人數：${params.participants}</div>`;
  swal2HtmlContent += `<div>申請人：${params.rentName}</div>`;
  swal2HtmlContent += `<div>聯絡方式：${params.rentContact}</div>`;
  swal2HtmlContent += `<div>租借開始時間：${params.activitySDT}</div>`;
  swal2HtmlContent += `<div>租借結束時間：${params.activityEDT}</div>`;

  swal2.fire({
    title: '確認活動內容',
    html: swal2HtmlContent,
    footer: '<div>送出後無法修改且場地方最終審查權與取消場地的權力</div>',
    showCancelButton: true,
    confirmButtonText: '送出',
    cancelButtonText: '取消',
  })
  .then((result) => {
    if (result.value) {
      loadingEl.style.display = 'flex';

      axios({
        url: `https://script.google.com/macros/s/${queryParams.get('gs-id')}/exec`,
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      .then((res) => {
        loadingEl.style.display = 'none';

        activityNameEl.value = '';
        participantsEl.value = 10;
        rentNameEl.value = '';
        rentContactEl.value = '';
        activitySDT_El.value = '';
        activityEDT_El.value = '';
        console.log('Success');
      })
      .catch((error) => {
        console.log('Failure:: ', error);
      });
    }
  })
  .catch((err) => {
    console.log('err:: ', err);
  });

  return false;
}
