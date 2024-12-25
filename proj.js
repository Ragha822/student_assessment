// Ensure DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const captchaInput = document.getElementById("captcha");
  const captchaDisplay = document.createElement("div");
  const submitButton = document.querySelector("button");

  // Generate a random captcha
  function generateCaptcha() {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    captchaDisplay.textContent = `Captcha: ${randomNum}`;
    captchaDisplay.style.marginBottom = "10px";
    captchaDisplay.style.fontSize = "18px";
    captchaDisplay.style.color = "#fff";
    form.insertBefore(captchaDisplay, captchaInput);
    return randomNum;
  }

  let captchaCode = generateCaptcha();

  // Form validation before submission
  form.addEventListener("submit", (e) => {
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const captchaValue = captchaInput.value;

    if (!role || !username || !password || !captchaValue) {
      e.preventDefault();
      alert("All fields are required. Please fill out the form.");
      return;
    }

    if (parseInt(captchaValue) !== captchaCode) {
      e.preventDefault();
      alert("Incorrect captcha. Please try again.");
      captchaCode = generateCaptcha(); // Refresh captcha
      captchaInput.value = ""; // Clear captcha input
    }
  });
});
