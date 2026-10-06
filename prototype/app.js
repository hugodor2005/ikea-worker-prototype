let currentRating = '';
let reportData = {
    overtime: { answer: '', details: '' },
    safety: { answer: '', details: '' },
    wages: { answer: '', details: '' },
    harassment: { answer: '', details: '' },
    other: { answer: '', details: '' }
};

function handleRating(rating) {
    currentRating = rating;
    
    // Visually highlight selected smiley
    document.querySelectorAll('.smiley-btn').forEach(btn => btn.classList.remove('selected'));
    if(rating === 'positive') document.getElementById('btn-pos').classList.add('selected');
    if(rating === 'neutral') document.getElementById('btn-neu').classList.add('selected');
    if(rating === 'negative') document.getElementById('btn-neg').classList.add('selected');

    if (rating === 'positive') {
        document.getElementById('detailed-questions').classList.add('hidden');
        submitFinalReport();
    } else {
        document.getElementById('detailed-questions').classList.remove('hidden');
        
        // Safely scroll to the bottom of the container
        const scrollArea = document.getElementById('form-scroll-area');
        setTimeout(() => {
            scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
        }, 50);
    }
}

function handleToggle(topic, answer) {
    reportData[topic].answer = answer;

    // Clear previous selections
    document.getElementById(`${topic}-yes`).classList.remove('selected-yes');
    document.getElementById(`${topic}-no`).classList.remove('selected-no');
    
    if (answer === 'Yes') {
        document.getElementById(`${topic}-yes`).classList.add('selected-yes');
        document.getElementById(`${topic}-text-container`).classList.remove('hidden');
    } else {
        document.getElementById(`${topic}-no`).classList.add('selected-no');
        document.getElementById(`${topic}-text-container`).classList.add('hidden');
        document.getElementById(`${topic}-details`).value = '';
    }
}

function submitFinalReport() {
    // Gather any typed text before submitting
    Object.keys(reportData).forEach(topic => {
        const textArea = document.getElementById(`${topic}-details`);
        if(textArea) {
            reportData[topic].details = textArea.value;
        }
    });

    const newReport = {
        id: Date.now(),
        date: new Date().toISOString(),
        rating: currentRating,
        issues: reportData,
        status: 'Open'
    };

    let reports = JSON.parse(localStorage.getItem('ikea_reports')) || [];
    reports.push(newReport);
    localStorage.setItem('ikea_reports', JSON.stringify(reports));

    // Swap to thanks screen
    document.getElementById('form-scroll-area').classList.remove('active');
    document.getElementById('form-scroll-area').classList.add('hidden');
    
    document.getElementById('screen-thanks').classList.remove('hidden');
    document.getElementById('screen-thanks').classList.add('active');

    setTimeout(() => {
        resetKiosk();
    }, 4000);
}

function resetKiosk() {
    currentRating = '';
    reportData = {
        overtime: { answer: '', details: '' },
        safety: { answer: '', details: '' },
        wages: { answer: '', details: '' },
        harassment: { answer: '', details: '' },
        other: { answer: '', details: '' }
    };

    document.getElementById('detailed-questions').classList.add('hidden');
    document.querySelectorAll('.smiley-btn').forEach(btn => btn.classList.remove('selected'));
    
    Object.keys(reportData).forEach(topic => {
        document.getElementById(`${topic}-yes`).classList.remove('selected-yes');
        document.getElementById(`${topic}-no`).classList.remove('selected-no');
        document.getElementById(`${topic}-text-container`).classList.add('hidden');
        document.getElementById(`${topic}-details`).value = '';
    });

    document.getElementById('screen-thanks').classList.remove('active');
    document.getElementById('screen-thanks').classList.add('hidden');
    
    document.getElementById('form-scroll-area').classList.remove('hidden');
    document.getElementById('form-scroll-area').classList.add('active');
    document.getElementById('form-scroll-area').scrollTop = 0;
}