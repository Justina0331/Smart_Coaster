// bootstrap-5.3.2-examples dashboard
/* globals Chart:false */

(() => {
  'use strict'

  // Graphs
  const ctx = document.getElementById('myChart');
  console.log(`records: ${records}`); // from oldest to latest 
  let date_labels = records.map(record => record.date);
  let amount_data = records.map(record => record.amount);
  let days = 7;
  // console.log(`date_labels: ${date_labels}`);
  // console.log(`amount_data: ${amount_data}`);
  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: date_labels.slice(date_labels.length - days, ),
      datasets: [{
        data: amount_data.slice(amount_data.length - days, ),
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          boxPadding: 3
        }
      }
    }
  });
  function updateChartAndDropDown(ds) {
    days = (ds > date_labels.length) ? date_labels.length : ds;
    myChart.data.labels = date_labels.slice(date_labels.length - days, );
    myChart.data.datasets[0].data = amount_data.slice(amount_data.length - days, );
    myChart.update();
    console.log(`chart updated last ${ds} days\n`);
    let days_list = [3, 7, 10, 30];
    for (let i = 0; i < days_list.length; i++) {
      if (days_list[i] === ds) {
        document.getElementById(`last${days_list[i]}DaysBtn`).classList.add('active');
        document.getElementById('lastDropdownBtn').innerHTML = `Last ${ds} Days`;
      }
      else {
        document.getElementById(`last${days_list[i]}DaysBtn`).classList.remove('active');
      }
    }
  }
  // Chart button handler
  document.getElementById('last3DaysBtn').addEventListener('click', () => {updateChartAndDropDown(3);});
  document.getElementById('last7DaysBtn').addEventListener('click', () => {updateChartAndDropDown(7);});
  document.getElementById('last10DaysBtn').addEventListener('click', () => {updateChartAndDropDown(10);});
  document.getElementById('last30DaysBtn').addEventListener('click', () => {updateChartAndDropDown(30);});
  let funny_url = ['https://youtu.be/dQw4w9WgXcQ', 'https://youtu.be/dMTy6C4UiQ4'];
  document.getElementById('nothingBtn').addEventListener('click', () => {
    let random_url = funny_url[Math.floor(Math.random() * funny_url.length)];
    window.open(random_url);
  });

  // Export button handler (download chart as png)
  const exportButton = document.getElementById('exportButton');
  exportButton.addEventListener('click', () => {
    // exportButton.href = myChart.toBase64Image()
    let link = document.createElement('a')
    link.href = document.getElementById('myChart').toDataURL('image/png')
    // window.open(link)
    link.download = 'chart.png'
    link.click()
    link.remove()
    console.log('chart exported\n')
  });

  // Drink Progress Bar
  const drinkProgressBar = document.getElementById('drinkProgressBar');
  const drinkProgressText = document.getElementById('drinkProgressText');
  const dailyGoal = 2000; // ml
  let drinkProgress = today_amount;
  let drinkProgressPercent = drinkProgress > dailyGoal ? 100 : (drinkProgress / dailyGoal) * 100;
  let percentExpress = true;
  drinkProgressBar.style.width = drinkProgressPercent;
  drinkProgressBar.setAttribute('aria-valuenow', drinkProgressPercent);
  // drinkProgressText.innerHTML = drinkProgress + 'ml / ' + dailyGoal + 'ml' + ' (' + drinkProgressPercent.toFixed(2) + '%)';
  drinkProgressText.innerHTML = `${drinkProgressPercent}%`;
  if (drinkProgressPercent >= 100) {
    drinkProgressBar.children[0].classList = 'progress-bar' + ' ' + 'text-bg-success' + ' ' + 'bg-success' + ' ' + `w-${drinkProgressPercent}`;
  }
  else if (drinkProgressPercent >= 75) {
    drinkProgressBar.children[0].classList = 'progress-bar' + ' ' + 'text-bg-info' + ' ' + 'bg-info' + ' ' + `w-${drinkProgressPercent}`;
  }
  else if (drinkProgressPercent >= 50) {
    drinkProgressBar.children[0].classList = 'progress-bar' + ' ' + 'text-bg-warning' + ' ' + 'bg-warning' + ' ' + `w-${drinkProgressPercent}`;
  }
  else if (drinkProgressPercent >= 25) {
    drinkProgressBar.children[0].classList = 'progress-bar' + ' ' + 'text-bg-secondary'+ ' ' + 'bg-secondary' + ' ' + `w-${drinkProgressPercent}`;
  }
  else {
    drinkProgressBar.children[0].classList = 'progress-bar' + ' ' + 'text-bg-danger' + ' ' + 'bg-danger' + ' ' + `w-${drinkProgressPercent}`;
  }
  console.log('drink progress bar updated\n');
  drinkProgressText.addEventListener('click', () => {
    // change the text expression to show the amount of water intake
    if (percentExpress) {
      drinkProgressText.innerHTML = `${drinkProgress} / ${dailyGoal}ml`;
      percentExpress = false;
    }
    else {
      drinkProgressText.innerHTML = `${drinkProgressPercent.toFixed(2)}%`;
      percentExpress = true;
    }
    console.log('drink progress text expression change\n');
  });

  // Water Intake History
  // const waterIntakeHistory = document.getElementById('waterIntakeHistory');
  // function renderWaterIntakeHistory() {
  //   let waterIntakeHistoryHTML = '';
  //   for (let i = 0; i < water_intake_history.length; i++) {
  //     waterIntakeHistoryHTML += '<tr>';
  //     waterIntakeHistoryHTML += '<td>' + water_intake_history[i].date + '</td>';
  //     waterIntakeHistoryHTML += '<td>' + water_intake_history[i].amount + 'ml</td>';
  //     waterIntakeHistoryHTML += '</tr>';
  //   }
  //   waterIntakeHistory.innerHTML = waterIntakeHistoryHTML;
  // }

})();
