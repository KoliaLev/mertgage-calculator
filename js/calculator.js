let formForAddBank = document.getElementById("calculator-form");

formForAddBank.addEventListener("submit", addBank);

// const banks = [
//   // {
//   //   bankName: "FIRST Bank",
//   //   interestRate: "8",
//   //   maxLoan: "4000000",
//   //   minDownPayment: "20",
//   //   loanTerm: "20",
//   // },
//   // {
//   //   bankName: "Second Bank",
//   //   interestRate: "5",
//   //   maxLoan: "2000000",
//   //   minDownPayment: "30",
//   //   loanTerm: "10",
//   // },
// ];

loadBankToPage();

function addBank(event) {
  event.preventDefault();
  const bank = {};

  let bankName = document.getElementById("bank_name");
  let interestRate = document.getElementById("interest_rate");
  let maxLoan = document.getElementById("maximum_loan");
  let minDownPayment = document.getElementById("minimum_down_payment");
  let loanTerm = document.getElementById("loan_term");

  if (
    !bankName.value.trim() ||
    !interestRate.value.trim() ||
    !maxLoan.value.trim() ||
    !minDownPayment.value.trim() ||
    !loanTerm.value.trim()
  ) {
    console.log("не все поля заполнены");
    // showMistakeMessage(event);
    showNote(bankName, "не все поля заполнены");
  } else if (isBank(bankName.value)) {
    // showMessageIsBank(event);
    showNote(bankName, "такой банк уже есть в базе");
  } else {
    bank.bankName = bankName.value.trim();
    bank.interestRate = interestRate.value.trim();
    bank.maxLoan = maxLoan.value.trim();
    bank.minDownPayment = minDownPayment.value.trim();
    bank.loanTerm = loanTerm.value.trim();

    banks.push(bank);
    addBankToPage(bank);

    console.log(banks);

    bankName.value = "";
    interestRate.value = "";
    maxLoan.value = "";
    minDownPayment.value = "";
    loanTerm.value = 12;
  }
}

function isBank(name) {
  for (const bank of banks) {
    console.log("проверено " + bank.bankName);
    if (bank.bankName == name) return true;
  }
}

// function showMessageIsBank(event) {
//   console.log("такой банк уже есть в базе даных");
//   const message = document.createElement("div");
//   message.style.position = "absolute";
//   message.style.color = "red";
//   message.innerText = "такой банк уже есть в базе даных";

//   console.log(event);
//   console.log(message.clientWidth);
//   document.body.append(message);
//   message.style.left =
//     event.srcElement.offsetLeft + event.srcElement.offsetWidth / 2 - message.clientWidth / 2 + "px";
//   message.style.top = event.srcElement.offsetHeight + event.srcElement.offsetTop + "px";
//   console.log(message.clientWidth);
//   setInterval(() => message.remove(), 1500);
// }

// function showMistakeMessage(event) {
//   // доделать координаты сообщения
//   const message = document.createElement("div");
//   message.style.position = "absolute";
//   message.style.color = "red";
//   message.innerText = "не все поля заполнены";

//   console.log(event);
//   console.log(message.clientWidth);
//   document.body.append(message);
//   message.style.left =
//     event.srcElement.offsetLeft + event.srcElement.offsetWidth / 2 - message.clientWidth / 2 + "px";
//   message.style.top = event.srcElement.offsetHeight + event.srcElement.offsetTop + "px";

//   console.log(message.clientWidth);
//   setInterval(() => message.remove(), 1500);
// }

function mapBank(data) {
  const { values: rows } = data;
  const headerKeys = rows.shift();

  const banks = rows.map((row) => {
    const bank = {};
    row.forEach((cell, cellIndex) => {
      bank[headerKeys[cellIndex]] = cell;
    });
    return bank;
  });
  return banks;
}

function render() {
  let table = document.getElementById("table-of-banks");

  for (const bank of banks) {
    let line = document.createElement("tr");
    for (const param in bank) {
      let td = document.createElement("td");
      td.innerText = bank[param];
      line.append(td);
    }
    addButton(line, "edit");
    addButton(line, "del");
    addButton(line, "expand");
    table.lastElementChild.append(line);
  }
}

function loadBankToPage() {
  //
  const sheetId = "1THnbQE8Wqd7ATyg3rdbZB8xsWG8HMdBgT5u70PfDa_Q";
  const apiKey = "AIzaSyDdTUdVUMNo5ZuwGWcm0uxFE6ukg6YlcOE";
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Аркуш1?key=${apiKey}`)
    .then((response) => response.json())
    .then((responseData) => {
      banks = mapBank(responseData);
      render();
    });

  //
}

function addBankToPage(bank) {
  let table = document.getElementById("table-of-banks");
  let line = document.createElement("tr");
  for (const prop in bank) {
    let td = document.createElement("td");
    td.innerText = bank[prop];
    line.append(td);
  }
  addButton(line, "edit");
  addButton(line, "del");
  addButton(line, "expand");
  table.lastElementChild.append(line);
}

function addButton(tr, action) {
  let td = document.createElement("td");
  td.className = action;
  //   td.style.padding = 0;

  let button = document.createElement("button");
  button.innerText = action;
  button.style.padding = 0;
  button.style.margin = 0;
  td.append(button);
  tr.append(td);
  if (action == "del") {
    button.onclick = () => {
      button.parentElement.parentElement.remove();
      let nameBank = button.parentElement.parentElement.firstElementChild.innerText;
      deleteBank(nameBank);
    };
  }
  if (action == "edit") {
    button.onclick = () => {
      // превращаем ячейки строки на инпуты
      let nameBank = button.parentElement.parentElement.firstElementChild.innerText;
      let lineCells = button.parentElement.parentElement.getElementsByTagName("td");
      for (let cell = 0; cell < 5; cell++) {
        text = lineCells[cell].innerText;
        console.log(text + " переданый текс в инпут ");
        lineCells[cell].innerHTML = `
        <input type="text" value="${text}" style="padding: 0px; margin: 0px;" /> 
        `;
      }

      lineCells[5].firstChild.hidden = true; // скрываем кнопку 'edit'

      let buttonSave = document.createElement("button"); // добавляем кнопку 'сохранить'
      buttonSave.innerText = "save";
      buttonSave.style.padding = 0;
      buttonSave.style.margin = 0;
      lineCells[5].append(buttonSave);

      buttonSave.onclick = () => {
        lineCells[5].firstChild.hidden = false;
        lineCells[5].lastElementChild.remove();

        for (let cell = 0; cell < 5; cell++) {
          text = lineCells[cell].firstElementChild.value;
          lineCells[cell].innerHTML = `${text}`;
        }

        editBank(nameBank, lineCells);
      };
    };
  }
  if (action == "expand") {
    // save bank to object

    //   opend modal
    button.onclick = () => {
      let nameBank = button.parentElement.parentElement.firstElementChild.innerText;

      document.getElementById("id02").style.display = "block";
      createModalBank(nameBank);
    };
  }
}

function createModalBank(name) {
  let calcBank = {};
  for (let i = 0; i < banks.length; i++) {
    if (banks[i].bankName == name) {
      calcBank = { ...banks[i] };
    }
  }
  console.log(calcBank);

  document.getElementById("name-bank-modal").innerText = calcBank.bankName;
  document.getElementById("interest-rate-modal").innerText = calcBank.interestRate + ` %`;

  let ammountBorrowed = document.getElementById("amount-borrowed-modal");
  ammountBorrowed.value = `${calcBank.maxLoan}`;
  // нужно переделать обработчик что бы каждый раз создавался новый
  // а старый удалялся, ато сейчас запускается новый обработчик,
  // но первый остается работать сначальными первыми даными
  ammountBorrowed.removeEventListener("keyup", handlerForAmmountBoroved);
  ammountBorrowed.addEventListener("keyup", handlerForAmmountBoroved);

  let minPayment = document.getElementById("minimum-down-payment-modal");
  minPayment.value = `${(ammountBorrowed.value * calcBank.minDownPayment) / 100}`;
  minPayment.removeEventListener("keyup", handlerForMinPayment);
  minPayment.addEventListener("keyup", handlerForMinPayment);

  let term = document.getElementById("select-loan-term");
  term.innerHTML = "";
  for (let i = 1; i <= calcBank.loanTerm; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    term.append(option);
  }

  document.getElementById("calculator-btn").onclick = calculationOfPayments;

  function handlerForAmmountBoroved() {
    if (+ammountBorrowed.value > +calcBank.maxLoan) {
      console.log("в обработчике нажатия клавиши. calcBank: ");
      console.log(calcBank);
      console.log("банк может дать сумму не больше " + calcBank.maxLoan);
      console.log("а вы хотите взять сумму:  " + ammountBorrowed.value);
      showNote(ammountBorrowed, "сумма превышает макс ссуду банка");
      ammountBorrowed.value = `${calcBank.maxLoan}`;
    } else {
      document.getElementById("minimum-down-payment-modal").value = `${
        (ammountBorrowed.value * calcBank.minDownPayment) / 100
      }`;
    }
  }

  function handlerForMinPayment() {
    if (minPayment.value < (ammountBorrowed.value * calcBank.minDownPayment) / 100) {
      console.log("there");
      showNote(minPayment, "min платеж не может юыть меньше чем предусмотрено банком");
      // minPayment.value = `${(ammountBorrowed.value * calcBank.minDownPayment) / 100}`;
    }
  }
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

function deleteBank(name) {
  for (let i = 0; i < banks.length; i++) {
    if (banks[i].bankName == name) {
      console.log(" будет удален банк " + banks[i].bankName);
      banks.splice(i, 1);
      break;
    }
  }
}

function editBank(name, props) {
  for (let i = 0; i < banks.length; i++) {
    console.log("передано имя банка: " + name);
    console.log("перебор банков. сейчас смотрим " + banks[i].bankName);
    if (banks[i].bankName == name) {
      banks[i].bankName = props[0].innerHTML;
      banks[i].interestRate = props[1].innerHTML;
      banks[i].maxLoan = props[2].innerHTML;
      banks[i].minDownPayment = props[3].innerHTML;
      banks[i].loanTerm = props[4].innerHTML;
    }
  }
}

function showNote(anchor, html) {
  anchor.parentElement.style.position = "relative";
  let note = document.createElement("div");
  note.className = "note";
  note.innerHTML = html;
  note.style.zIndex = "999";
  note.style.position = "absolute";
  anchor.parentElement.append(note);
  anchor.style.background = "red";

  positionAt(anchor, note);
  setInterval(() => {
    note.remove();
    anchor.style.background = "white";
  }, 1500);
}

function positionAt(anchor, elem) {
  // elem.style.left = anchorCoords.left + "px";
  elem.style.top = anchor.parentElement.clientHeight + "px";
}
