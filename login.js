const loginButton = document.getElementById("loginButton");
const captchaCode = document.getElementById("captchaCode");
const refreshCaptcha = document.getElementById("refreshCaptcha");
const captchaInput = document.getElementById("captchaInput");

function generateCaptcha() {
  const randomCaptcha = Math.random().toString(36).substring(2, 8);
  captchaCode.textContent = randomCaptcha.toUpperCase();
}

refreshCaptcha.addEventListener("click", generateCaptcha);

loginButton.addEventListener("click", () => {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill out all fields.");
    return;
  }

  if (captchaInput.value.toUpperCase() !== captchaCode.textContent) {
    alert("Invalid Captcha.");
    return;
  }

  if (role === "Admin") {
    window.location.href = "allocation.html";
  } else {
    alert("Student portal is under development.");
  }
});

generateCaptcha();
