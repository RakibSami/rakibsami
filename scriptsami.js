// ===== EMAILJS INIT =====
(function () {

  emailjs.init("Ssa8BRkKPEimes6dB");
})();

// ===== FORM HANDLING =====
function handleFormSubmission(e) {
  e.preventDefault(); // ফর্ম reload বন্ধ করবে

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const subject = document.getElementById("subject")?.value.trim();
  const message = document.getElementById("message")?.value.trim();

  // ===== VALIDATION =====
  if (!name || !email || !subject || !message) {
    return showNotification("Please fill in all required fields", "error");
  }

  if (!isValidEmail(email)) {
    return showNotification("Enter a valid email address", "error");
  }

  // ===== TEMPLATE PARAMS =====
  const templateParams = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message,
  };

  // ===== SEND EMAIL =====
  emailjs
    .send("service_hn2arzn", "template_l3tryyc", templateParams)
    .then((response) => {
      console.log("✅ SUCCESS:", response);
      showNotification("Message sent successfully!", "success");
      document.getElementById("contactForm")?.reset();
    })
    .catch((err) => {
      console.error("❌ EmailJS Error:", err);
      showNotification("Failed to send message. Check console.", "error");
    });
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== NOTIFICATION UI =====
function showNotification(msg, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
    }"></i>
    <span>${msg}</span>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Slide in
  setTimeout(() => (notification.style.transform = "translateX(0)"), 100);

  // Slide out
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== FORM EVENT LISTENER =====
document
  .getElementById("contactForm")
  ?.addEventListener("submit", handleFormSubmission);
