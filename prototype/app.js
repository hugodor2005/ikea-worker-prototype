let currentRating = '';
const emptyReport = () => ({
  overtime: { answer: '', details: '' },
  safety: { answer: '', details: '' },
  wages: { answer: '', details: '' },
  harassment: { answer: '', details: '' },
  other: { answer: '', details: '' }
});
let reportData = emptyReport();
let resetTimer;

function handleRating(rating) {
  currentRating = rating;
  document.querySelectorAll('.smiley-btn').forEach(button => button.classList.remove('selected'));
  const selected = { positive: 'btn-pos', neutral: 'btn-neu', negative: 'btn-neg' }[rating];
  if (selected) document.getElementById(selected).classList.add('selected');
  const details = document.getElementById('detailed-questions');
  if (rating === 'positive') {
    details.classList.add('hidden');
    submitFinalReport();
    return;
  }
  details.classList.remove('hidden');
  details.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleToggle(topic, answer) {
  if (!reportData[topic]) return;
  reportData[topic].answer = answer;
  const yes = document.getElementById(`${topic}-yes`);
  const no = document.getElementById(`${topic}-no`);
  const container = document.getElementById(`${topic}-text-container`);
  yes.classList.toggle('selected-yes', answer === 'Yes');
  no.classList.toggle('selected-no', answer === 'No');
  container.classList.toggle('hidden', answer !== 'Yes');
  if (answer !== 'Yes') document.getElementById(`${topic}-details`).value = '';
}

function showThanks(message) {
  document.getElementById('form-scroll-area').classList.add('hidden');
  document.getElementById('screen-thanks').classList.remove('hidden');
  document.getElementById('thanks-copy').textContent = message;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(resetKiosk, 12000);
}

function submitFinalReport() {
  Object.keys(reportData).forEach(topic => {
    const field = document.getElementById(`${topic}-details`);
    if (field) reportData[topic].details = field.value.trim();
  });
  const newReport = {
    id: Date.now(),
    date: new Date().toISOString(),
    rating: currentRating,
    issues: reportData,
    status: 'Open'
  };
  try {
    const reports = JSON.parse(localStorage.getItem('ikea_reports') || '[]');
    reports.push(newReport);
    localStorage.setItem('ikea_reports', JSON.stringify(reports));
    showThanks('Your demo answers were saved in this browser only. They are not sent anywhere.');
  } catch (error) {
    showThanks('The browser could not save these demo answers. No information was sent anywhere.');
  }
}

function skipFeedback() {
  currentRating = '';
  reportData = emptyReport();
  showThanks('You skipped feedback. No answers were saved.');
}

function resetKiosk() {
  clearTimeout(resetTimer);
  currentRating = '';
  reportData = emptyReport();
  document.querySelectorAll('.smiley-btn').forEach(button => button.classList.remove('selected'));
  Object.keys(reportData).forEach(topic => {
    document.getElementById(`${topic}-yes`).classList.remove('selected-yes');
    document.getElementById(`${topic}-no`).classList.remove('selected-no');
    document.getElementById(`${topic}-text-container`).classList.add('hidden');
    document.getElementById(`${topic}-details`).value = '';
  });
  document.getElementById('detailed-questions').classList.add('hidden');
  document.getElementById('screen-thanks').classList.add('hidden');
  document.getElementById('form-scroll-area').classList.remove('hidden');
  document.getElementById('form-scroll-area').scrollTop = 0;
}
