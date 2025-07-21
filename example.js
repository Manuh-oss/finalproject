const dates = document.querySelectorAll(".date");
const array = [];

dates.forEach((date) => {
  const textContent = date.textContent.trim();
  let withoutYear = "";
  
  if (textContent.length === 8) {
    withoutYear = textContent.slice(0, 3);
  } else if (textContent.length === 9) {
    withoutYear = textContent.slice(0, 4);
  }

  console.log(withoutYear); // Might return NaN for text like "Jan "
});

