document.getElementById("suggestions").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = {
    english: e.target.english.value,
    naviminga: e.target.naviminga.value,
    grammar_rules: e.target.grammar_rules.value,
    name: e.target.name.value
  };
  fetch("https://script.google.com/macros/s/AKfycbzJ3GwnZuV6A4SD9xiw3WCK2Hbc1mZ7wTCOzj_v1wiRaBfux1wdv66F6P7HSimUTqluHQ/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'success') {
      alert('Submission Successful!');
      document.getElementById("suggestions").reset();
    } else {
      alert('Sumission Failed. Please Try Again.');
    }
  })
  .catch(error => {
    alert('Error: ' + error);
  });
});
