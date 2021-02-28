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

const promise = loadBankToPage()
  .then((response) => response.json())
  .then((responseData) => {
    banks = mapBank(responseData);
    render();
  });

let formForAddBank = document.getElementById("calculator-form");

formForAddBank.addEventListener("submit", addBank);

// //////////////

function addBank(event) {
  event.preventDefault();
  const bank = {};

  let bankName = formForAddBank.bank_name;
  let interestRate = formForAddBank.interest_rate;
  let maxLoan = formForAddBank.maximum_loan;
  let minDownPayment = formForAddBank.minimum_down_payment;
  let loanTerm = formForAddBank.loan_term;

  if (!bankName.value.trim()) {
    showNote(bankName, "введите название банка");
  } else if (isBank(bankName.value)) {
    showNote(bankName, "такой банк уже есть в базе");
  } else if (isNaN(interestRate.value.trim()) || !interestRate.value.trim()) {
    console.log(interestRate.value.trim());
    showNote(interestRate, "введите число");
  } else if (isNaN(maxLoan.value.trim()) || !maxLoan.value.trim()) {
    showNote(maxLoan, "введите число");
  } else if (isNaN(minDownPayment.value.trim()) || !minDownPayment.value.trim()) {
    showNote(minDownPayment, "введите число");
  } else if (+interestRate.value.trim() >= 100) {
    showNote(interestRate, "проц ставка слижком большая");
  } else if (+minDownPayment.value.trim() >= 100) {
    showNote(minDownPayment, "мин сума взноса больше 100%");
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
  banks.forEach((bank) => addBankToPage(bank));
}

function addBankToPage(bank) {
  let table = document.getElementById("table-of-banks");
  let line = document.createElement("tr");
  for (const prop in bank) {
    let td = document.createElement("td");
    td.className = "bank-data";
    td.innerText = bank[prop];
    line.append(td);
  }
  addButton(line, "edit");
  addButton(line, "del");
  addButton(line, "expand");
  table.lastElementChild.append(line);
}

function addButton(elem, action) {
  let td = document.createElement("td");
  td.className = "td-for-btn";
  //   td.style.padding = 0;

  let button = document.createElement("button");
  button.innerText = action;
  button.style.padding = 0;
  button.style.margin = 0;
  td.append(button);
  elem.append(td);
  if (action == "del") {
    eventBtnDelBank();
  }
  if (action == "edit") {
    eventBtnEditingBank();
  }
  if (action == "expand") {
    eventBtnExpandBank();
  }

  function eventBtnDelBank() {
    button.onclick = () => {
      button.parentElement.parentElement.remove();
      let nameBank = button.parentElement.parentElement.firstElementChild.innerText;
      deleteBank(nameBank);
    };
  }

  function eventBtnExpandBank() {
    button.onclick = () => {
      let nameBank = button.parentElement.parentElement.firstElementChild.innerText;

      let bankForModal = getBankByName(nameBank);

      document.getElementById("id02").style.display = "block";
      createModalBank(bankForModal);
    };
  }

  function eventBtnEditingBank() {
    button.onclick = () => {
      // превращаем ячейки строки на инпуты
      let nameBank = button.parentElement.parentElement.firstElementChild.innerText;
      let lineCells = button.parentElement.parentElement.getElementsByTagName("td");

      lineCells[0].innerHTML = `<input type="text" value="${lineCells[0].innerText}" class="table-edit-input" /> `;
      lineCells[1].innerHTML = `<input type="number" value="${lineCells[1].innerText}" class="table-edit-input" /> `;
      lineCells[2].innerHTML = `<input type="number" value="${lineCells[2].innerText}" class="table-edit-input" /> `;
      lineCells[3].innerHTML = `<input type="number" value="${lineCells[3].innerText}" class="table-edit-input" /> `;
      lineCells[4].innerHTML = `<input type="number" value="${lineCells[4].innerText}" class="table-edit-input" /> `;

      ///
      // for (let cell = 0; cell < 5; cell++) {
      //   text = lineCells[cell].innerText;
      //   console.log(text + " переданый текс в инпут ");
      //   lineCells[cell].innerHTML = `
      //   <input type="text" value="${text}" style="padding: 0px; margin: 0px;" />
      //   `;
      // }
      ///

      lineCells[5].firstChild.hidden = true; // скрываем кнопку 'edit'

      let buttonSave = document.createElement("button"); // добавляем кнопку 'сохранить'
      buttonSave.innerText = "save";
      buttonSave.style.padding = 0;
      buttonSave.style.margin = 0;
      lineCells[5].append(buttonSave);

      buttonSave.onclick = () => {
        if (editBank(nameBank, lineCells)) {
          for (let cell = 0; cell < 5; cell++) {
            text = lineCells[cell].firstElementChild.value;
            lineCells[cell].innerHTML = `${text}`;
          }

          lineCells[5].firstChild.hidden = false; // показывает кнопку edit
          lineCells[5].lastElementChild.remove(); // удаляем кнопку save
        } else {
          showNote(buttonSave, "имеются незаполненые поля");
        }
      };
    };
  }
}

function getBankByName(name) {
  return banks.find((bank) => bank.bankName == name);
}

function deleteBank(name) {
  let index = banks.findIndex((bank) => (bank.bankName = name));

  console.log(" будет удален банк " + getBankByName(name).bankName);

  banks.splice(index, 1);

  // for (let i = 0; i < banks.length; i++) {
  //   if (banks[i].bankName == name) {
  //     console.log(" будет удален банк " + banks[i].bankName);
  //     banks.splice(i, 1);
  //     break;
  //   }
  // }
}

function editBank(name, props) {
  let bank = banks.find((bank) => bank.bankName == name);
  console.log(props);

  props = Array.from(props)
    .slice(0, 5)
    .map((el) => el.firstElementChild.value);

  console.log(props);

  console.log("передано имя банка: " + name);
  console.log("найден банк: " + bank.bankName);

  if (props[0] && props[1] && props[2] && props[3] && props[4]) {
    bank.bankName = props[0];
    bank.interestRate = props[1];
    bank.maxLoan = props[2];
    bank.minDownPayment = props[3];
    bank.loanTerm = props[4];

    return true;
  } else {
    return false;
  }
}

function showNote(anchor, html) {
  let note = document.createElement("div");
  note.className = "note";
  note.style.background = "white";
  note.style.opacity = "0.9";
  note.innerHTML = html;

  anchor.parentElement.append(note);
  anchor.style.background = "red";

  positionAt(anchor, note);
  const interval = setInterval(() => {
    note.remove();
    anchor.style.background = "";
    clearInterval(interval);
  }, 1500);

  function positionAt(anchor, elem) {
    // elem.style.left = anchorCoords.left + "px";
    anchor.parentElement.style.position = "relative";
    elem.style.position = "absolute";
    elem.style.zIndex = "999";
    elem.style.top = anchor.parentElement.clientHeight + "px";
  }
}
