const filterButtons = document.querySelectorAll('.filter');
const signalRows = document.querySelectorAll('#signal-rows tr');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  signalRows.forEach(row => {
    row.hidden = category !== 'all' && row.dataset.category !== category;
  });
}));

const exampleDetails = {
  hours: 'Review the working-hours pattern with worker-informed context and choose a safe follow-up route.',
  safety: 'Explore the safety signal with local context before deciding whether and how to follow up.',
  pay: 'Consider local expertise, worker input, and a clear remedy path when reviewing payment concerns.'
};
const dialog = document.getElementById('case-dialog');
document.querySelectorAll('.view-case').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.case;
  document.getElementById('dialog-title').textContent = button.closest('.case-card').querySelector('h3').textContent;
  document.getElementById('dialog-copy').textContent = exampleDetails[key];
  dialog.showModal();
}));
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
