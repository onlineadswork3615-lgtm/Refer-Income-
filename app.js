// Initialize Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // App takes full height

// Get User Info from Telegram
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById('userName').innerText = user.first_name + (user.last_name ? ' ' + user.last_name : '');
} else {
    document.getElementById('userName').innerText = "Demo User";
}

// Demo Data (In production, this comes from your database)
document.getElementById('balanceAmount').innerText = "৳120.00";

const demoHistory = [
    { title: "Referral Bonus", date: "Today, 10:30 AM", amount: "+৳10.00" },
    { title: "Account Activation", date: "Yesterday, 2:00 PM", amount: "-৳10.00" },
    { title: "Referral Bonus", date: "Yesterday, 11:00 AM", amount: "+৳10.00" }
];

// Load History
const historyList = document.getElementById('historyList');
demoHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
        <div class="item-left">
            <strong>${item.title}</strong>
            <span>${item.date}</span>
        </div>
        <div class="item-right">${item.amount}</div>
    `;
    historyList.appendChild(div);
});

// Copy Referral Link
function copyLink() {
    const linkInput = document.getElementById('refLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile
    navigator.clipboard.writeText(linkInput.value);
    
    // Telegram Alert
    tg.showAlert("Referral link copied!");
}

// Modal Functions
function openModal() {
    document.getElementById('withdrawModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('withdrawModal').style.display = 'none';
}

// Request Withdraw
function requestWithdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    if (amount < 50) {
        tg.showAlert("Minimum withdrawal amount is ৳50");
        return;
    }
    
    // In production, send this to backend
    tg.showAlert(`Withdrawal request for ৳${amount} submitted successfully!`);
    closeModal();
}
