let sentiment;
let statusEl;
let submitBtn;
let inputBox;
let sentimentResult;
let reviewsScore = [obj = {
  value: 0,
  label: 'Average'
}, obj = {
  value: 0,
  label: 'Happy'
}, obj = {
  value: 0,
  label: 'UnHappy'
}];

function setup() {
  console.log("inject");
  // initialize sentiment
  sentiment = ml5.sentiment('movieReviews', modelReady);

  // setup the html environment
  statusEl = document.querySelector('#statusText')
  // statusEl.innerHTML = 'Loading Model...';

  inputBox = document.querySelector('#inputText');
  submitBtn = document.querySelector('#submitBtn');
  sentimentResult = document.querySelector('#score');

  // predicting the sentiment on mousePressed()
  submitBtn.addEventListener('click', getSentiment);
}

function InitChart() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Average', 'Happy', 'UnHappy'],
      datasets: [{
        label: '# of Votes',
        data: reviewsScore.sort(x => x.label).map(x => x.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      cutoutPercentage: 0,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

setup();
InitChart();

function getSentiment() {
  // get the values from the input
  const text = inputBox.value;
  // make the prediction
  const prediction = sentiment.predict(text);
  calculateScore(prediction.score);
  // display sentiment result on html page
  sentimentResult.innerHTML = prediction.score;
  InitChart();
}

function calculateScore(score) {
  let obj = {};
  let calScore;

  if (score <= 0.40) {
    selectedlabel = "UnHappy";
  }
  else if (score > 0.40 && score <= 0.70) {
    selectedlabel = "Average";
  }
  else if (score > 0.70 && score <= 1) {
    selectedlabel = "Happy";
  }
  var reduced = reviewsScore.filter(x => x.label == selectedlabel).map(x => x.value).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
  calScore = (1 + reduced);

  var selectedobj = reviewsScore.find(x => x.label == selectedlabel);
  if (selectedobj != null) {
    selectedobj.value = calScore;
  }
}

function modelReady() {
  // model is ready
  //statusEl.innerHTML = 'Engine Loaded';
}