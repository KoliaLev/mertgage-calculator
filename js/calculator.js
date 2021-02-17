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
    showNote(bankName, "не все поля заполнены");
  } else if (isBank(bankName.value)) {
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

  banks.forEach((bank) => {
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
  });
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

function addButton(elem, action) {
  let td = document.createElement("td");
  td.className = action;
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

  console.log("передано имя банка: " + name);
  console.log("найден банк: " + bank.bankName);

  bank.bankName = props[0].innerHTML;
  bank.interestRate = props[1].innerHTML;
  bank.maxLoan = props[2].innerHTML;
  bank.minDownPayment = props[3].innerHTML;
  bank.loanTerm = props[4].innerHTML;
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

  function positionAt(anchor, elem) {
    // elem.style.left = anchorCoords.left + "px";
    elem.style.top = anchor.parentElement.clientHeight + "px";
  }
}
