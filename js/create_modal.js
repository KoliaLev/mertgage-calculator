function createModalBank(bank) {
  console.log(bank);

  document.getElementById("name-bank-modal").innerText = bank.bankName;
  document.getElementById("interest-rate-modal").innerText = bank.interestRate + ` %`;

  let ammountBorrowed = document.getElementById("amount-borrowed-modal");
  ammountBorrowed.value = `${bank.maxLoan}`;
  ammountBorrowed.addEventListener("keyup", handlerForAmmountBoroved);

  let minPayment = document.getElementById("minimum-down-payment-modal");
  minPayment.value = `${(ammountBorrowed.value * bank.minDownPayment) / 100}`;
  minPayment.addEventListener("keyup", handlerForMinPayment);

  let term = document.getElementById("select-loan-term");
  term.innerHTML = "";
  for (let i = 1; i <= bank.loanTerm; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    term.append(option);
  }

  document.getElementById("calculator-btn").onclick = calculationOfPayments;

  function handlerForAmmountBoroved() {
    if (+ammountBorrowed.value > +bank.maxLoan) {
      console.log("в обработчике нажатия клавиши. calcBank: ");
      console.log(bank);
      console.log("банк может дать сумму не больше " + bank.maxLoan);
      console.log("а вы хотите взять сумму:  " + ammountBorrowed.value);
      showNote(ammountBorrowed, "сумма превышает макс ссуду банка");
      ammountBorrowed.value = `${bank.maxLoan}`;
    } else {
      document.getElementById("minimum-down-payment-modal").value = `${
        (ammountBorrowed.value * bank.minDownPayment) / 100
      }`;
    }
  }

  function handlerForMinPayment() {
    if (minPayment.value < (ammountBorrowed.value * bank.minDownPayment) / 100) {
      console.log("there");
      showNote(minPayment, "min платеж не может юыть меньше чем предусмотрено банком");
      // minPayment.value = `${(ammountBorrowed.value * calcBank.minDownPayment) / 100}`;
    }
  }

  var modalCalculator = document.getElementById("id02");
  document.getElementById("close-modal").addEventListener("click", () => {
    ammountBorrowed.removeEventListener("keyup", handlerForAmmountBoroved);
    minPayment.removeEventListener("keyup", handlerForMinPayment);
    modalCalculator.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modalCalculator) {
      ammountBorrowed.removeEventListener("keyup", handlerForAmmountBoroved);
      minPayment.removeEventListener("keyup", handlerForMinPayment);
      modalCalculator.style.display = "none";
      console.log(event.target);
    }
  };
}

function calculationOfPayments() {
  let rate = +document.getElementById("interest-rate-modal").innerText.split(" ")[0];
  let loan = +document.getElementById("amount-borrowed-modal").value;
  let firstPayment = +document.getElementById("minimum-down-payment-modal").value;
  let termYears = +document.getElementById("select-loan-term").value;

  loan = loan - firstPayment;
  let monthRate = rate / 12 / 100;

  let generalRate = Math.pow(1 + monthRate, termYears * 12);
  let monthPayment = (loan * monthRate * generalRate) / (generalRate - 1);
  monthPayment = Math.round(monthPayment);

  let countPayment = 1;

  let table = document.getElementById("table-of-calculator");
  // очистка таблицы (кроме шапки)
  [].slice.call(table.querySelectorAll("tr"), 1).forEach((elem) => elem.remove());

  createPaymentLine(monthPayment, loan, monthRate);
  table.querySelectorAll("td").forEach((elem) => {
    elem.style.paddingRight = "40px";
    elem.style.fontFamily = "monospace";
    elem.style.textAlign = "right";
  });

  function createPaymentLine(payment, loan, rate) {
    let tr = document.createElement("tr");
    let interest = Math.floor(loan * rate);
    let repayment = payment - interest;
    if (payment > loan + interest) {
      payment = loan + interest;

      loan = 0;
      tr.innerHTML = `
      <td>${countPayment++}</td>
      <td>${payment.toLocaleString()}</td>
      <td>${interest.toLocaleString()}</td>
      <td>${repayment.toLocaleString()}</td>
      <td>${loan.toLocaleString()}</td>
      `;
      table.lastElementChild.append(tr);
    } else {
      loan = loan - repayment;
      tr.innerHTML = `
      <td>${countPayment++}</td>
      <td>${payment.toLocaleString()}</td>
      <td>${interest.toLocaleString()}</td>
      <td>${repayment.toLocaleString()}</td>
      <td>${loan.toLocaleString()}</td>
      `;
      if (countPayment % 2 == 0) {
        tr.querySelectorAll("td").forEach((elem) => (elem.style.background = "rgb(148 218 3)"));
      }
      table.lastElementChild.append(tr);

      createPaymentLine(payment, loan, rate);
    }
  }
}
