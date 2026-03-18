const WEBHOOKS = {
    phone: 'https://discord.com/api/webhooks/1470777402505560146/YqY983Q2RpZ4qeWrqufjKn0apcGL7D2jtwG3TGIQnDAkw1fVFrkWhBbp3d_hBgdMHrjd',
    f2f: 'https://discord.com/api/webhooks/1470777501608317133/wsQWvXCEnAl_C_c_249G5t_vBq45Spz4lpi_Igo12Ae-sIRBoXsYZdKPwaR5a3Dbvrcv',
    question: 'https://discord.com/api/webhooks/1470836591617507409/P6N5cA-EyRIYeI9w7r1fcaHjc1FCizEPu3W5jEdOLoWxvxFPFK-zXB1PCY_gMNrJPlXb'
};

let captchaAnswer;

// --- CAPTCHA & MODAL LOGIC ---
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = num1 + num2;
    document.getElementById('captcha-question').innerText = `Security: ${num1} + ${num2} = `;
    const input = document.getElementById('captcha-input');
    if (input) input.value = "";
}

function toggleModal() {
    const modal = document.getElementById('applyModal');
    if (modal.style.display !== 'flex') {
        generateCaptcha();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Event Listeners for Modal
document.getElementById('openModalBtn').addEventListener('click', toggleModal);
document.getElementById('closeModalBtn').addEventListener('click', toggleModal);

// --- FORM SUBMISSION ---
document.getElementById('hookForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot check
    if (document.getElementById('honeypot').value !== "") return;
    
    const userAnswer = parseInt(document.getElementById('captcha-input').value);
    if (userAnswer !== captchaAnswer) {
        alert("Incorrect security answer.");
        generateCaptcha();
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending Securely...";

    const method = document.getElementById('contactMethod').value;
    const payload = {
        embeds: [{
            title: "Incoming Lead: " + method.toUpperCase(),
            color: method === 'f2f' ? 16764160 : method === 'question' ? 3447003 : 4936480,
            fields: [
                { name: "Name", value: document.getElementById('name').value, inline: true },
                { name: "Age", value: document.getElementById('age').value, inline: true },
                { name: "Phone", value: document.getElementById('phone').value, inline: true },
                { name: "Email", value: document.getElementById('email').value, inline: false },
                { name: "Interested Job", value: document.getElementById('jobType').value, inline: true },
                { name: "Notes", value: document.getElementById('note').value || "None" }
            ],
            timestamp: new Date()
        }]
    };

    fetch(WEBHOOKS[method], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('Thank you. SGT CRUZ will be in touch shortly.');
        toggleModal();
        this.reset();
    })
    .catch(() => alert('System error. Please call the office directly.'))
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Information";
    });
});

// --- FOOTER TAB SYSTEM ---
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("study-content");
    const tablinks = document.getElementsByClassName("footer-tab-btn");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active-panel');
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add('active-panel');
    evt.currentTarget.classList.add("active");
}
