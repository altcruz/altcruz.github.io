const WEBHOOKS = {
    phone: 'https://discord.com/api/webhooks/1470777402505560146/YqY983Q2RpZ4qeWrqufjKn0apcGL7D2jtwG3TGIQnDAkw1fVFrkWhBbp3d_hBgdMHrjd',
    f2f: 'https://discord.com/api/webhooks/1470777501608317133/wsQWvXCEnAl_C_c_249G5t_vBq45Spz4lpi_Igo12Ae-sIRBoXsYZdKPwaR5a3Dbvrcv',
    question: 'https://discord.com/api/webhooks/1470836591617507409/P6N5cA-EyRIYeI9w7r1fcaHjc1FCizEPu3W5jEdOLoWxvxFPFK-zXB1PCY_gMNrJPlXb'
};

let captchaAnswer;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = num1 + num2;
    document.getElementById('captcha-question').innerText = `Verify: ${num1} + ${num2} =`;
    document.getElementById('captcha-input').value = "";
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

document.getElementById('openModalBtn').addEventListener('click', toggleModal);
document.getElementById('closeModalBtn').addEventListener('click', toggleModal);

document.getElementById('hookForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (document.getElementById('honeypot').value !== "") return;
    
    const userAnswer = parseInt(document.getElementById('captcha-input').value);
    if (userAnswer !== captchaAnswer) {
        alert("Incorrect security answer. Please try again.");
        generateCaptcha();
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending Securely...";

    // --- GRABBING THE DATA ---
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const jobType = document.getElementById('jobType').value; // Added this
    const method = document.getElementById('contactMethod').value;
    const note = document.getElementById('note').value;

    let targetUrl = WEBHOOKS[method];
    let embedColor = (method === 'f2f') ? 16764160 : (method === 'question' ? 3447003 : 4936480);
    let typeLabel = method === 'f2f' ? "Face to Face" : (method === 'question' ? "❓ Question" : "📞 Phone Call");

    const payload = {
        embeds: [{
            title: "Incoming Lead: " + typeLabel,
            color: embedColor,
            fields: [
                { name: "Name", value: name, inline: true },
                { name: "Age", value: age, inline: true },
                { name: "Phone", value: phone, inline: true },
                { name: "Email", value: email, inline: false },
                { name: "Interested Job", value: jobType, inline: true }, // Added to Discord Message
                { name: "Notes", value: note || "No notes provided." }
            ],
            timestamp: new Date()
        }]
    };

    fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('Thank you, ' + name + '. SGT CRUZ will be in touch shortly.');
        toggleModal();
        document.getElementById('hookForm').reset();
    })
    .catch(() => alert('System error. Please call the office directly.'))
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Information";
    });
});
