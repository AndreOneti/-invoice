const { jsPDF } = window.jspdf;

const $pdfView = document.getElementById('myPdf');
const $produto_base = document.getElementById('produto_base');
const pdfModal = new bootstrap.Modal('#exampleModal', {});

;[
  fornecedor_nome,
  fornecedor_endereco,
  fornecedor_cep,
  fornecedor_cidade,
  fornecedor_estado,
  fornecedor_documento,
  fornecedor_telefone,
  fornecedor_vendedor,
  cliente_nome,
  cliente_endereco,
  cliente_cep,
  cliente_cidade,
  cliente_estado,
  cliente_documento,
  cliente_telefone,
  cliente_email
].forEach(field => {
  field.addEventListener('input', function updateValue() {
    const [obj, key] = field.name.split("_");

    if (obj === "cliente") {
      cliente[key] = this.value.trim();
    } else {
      fornecedor[key] = this.value.trim();
    }
  });
});

preview.addEventListener('click', _ => generatePDF());
salvar.addEventListener('click', _ => generatePDF(true));

let doc = new jsPDF('l');
let docName = "ORÇAMENTO.pdf";

const formPag = "A vista ";

const itens = [];

const cliente = {
  "nome": "",
  "endereco": "",
  "cep": "",
  "cidade": "",
  "estado": "",
  "documento": "",
  "telefone": "",
  "email": ""
}

const fornecedor = {
  "nome": "",
  "endereco": "",
  "cep": "",
  "cidade": "",
  "estado": "",
  "documento": "",
  "telefone": "",
  "vendedor": ""
}

//#region Functions
function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function twoDigits(digit) {
  if (0 <= digit && digit < 10) return "0" + digit.toString();
  return digit.toString();
}

function dateNowFormatted() {
  const d = new Date();
  return `${twoDigits(d.getDate())}/${twoDigits(d.getMonth() + 1)}/${twoDigits(d.getFullYear())} ${twoDigits(d.getHours())}:${twoDigits(d.getMinutes())}:${twoDigits(d.getSeconds())}`;
}

function dateNextWeekFormmated() {
  const today = new Date();
  return today.nextDay(7).format('dd/mm/yyyy');
}

function getTotalPrice() {
  return `R$ ${itens.reduce((acc, curr) => acc += curr.PRICE_REGULAR * curr.QUANTITY, 0).format()}`;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}
//#endregion

//#region Prototypes

Date.prototype.format = function () {
  let day = this.getDate();
  let month = this.getMonth() + 1;
  let year = this.getFullYear();
  let hour = this.getHours().toString().twoDigits();
  let minute = this.getMinutes().toString().twoDigits();
  let second = this.getSeconds().toString().twoDigits();
  let arg = arguments[0];
  if (arg && arg === "yyyy-mm-dd") return `${year}-${month.twoDigits()}-${day.twoDigits()}`;
  if (arg && arg === "dd-mm-yyyy") return `${day.twoDigits()}-${month.twoDigits()}-${year}`;
  if (arg && arg === "yyyy/mm/dd") return `${year}/${month.twoDigits()}/${day.twoDigits()}`;
  if (arg && arg === "dd/mm/yyyy") return `${day.twoDigits()}/${month.twoDigits()}/${year}`;
  if (arg && arg === "dd/mm/yyyy - hh:mm:ss") return `${day.twoDigits()}/${month.twoDigits()}/${year} - ${hour}:${minute}:${second}`;
  return `${year}-${month.twoDigits()}-${day.twoDigits()}`;
}

Date.prototype.nextDay = function (day) {
  const dateNow = new Date(this);
  return new Date(dateNow.setDate(dateNow.getDate() + day));
}

Number.prototype.twoDigits = function () {
  if (0 <= this && this < 10) return "0" + this.toString();
  return this.toString();
}

Number.prototype.format = function () {
  let [real, decimal] = this.toFixed(2).toString().split('.');
  real = real.reverse().splitToArray(3).join('.').reverse();
  decimal = (+decimal).twoDigits();
  return `${real},${decimal}`;
}

String.prototype.twoDigits = function () {
  if (0 <= Number(this) && Number(this) < 10)
    return "0" + Number(this).toString();
  return Number(this).toString();
}

String.prototype.splitToArray = function (minLength) {
  let index = Math.floor(this.length / minLength);
  if (this.length % minLength > 0) index = Number(index) + 1;
  const array = [];
  for (let i = 0; i < index; i++) {
    array.push(this.slice(minLength * i, minLength * (i + 1)));
  }
  return array;
}

String.prototype.reverse = function () {
  return this.split("").reverse().join("");
}
//#endregion

function updatePhoneMask(event) {
  const target = (event.currentTarget) ? event.currentTarget : event.srcElement;
  const phone = target.value.replace(/\D/g, '');
  const element = $(target);
  element.unmask();
  if (phone.length > 10) {
    element.mask("(99) 9 9999-9999");
  } else {
    element.mask("(99) 9999-9999");
  }
}

$("#cliente_cep").mask("99999-999");
$("#fornecedor_cep").mask("99999-999");

$("#fornecedor_telefone").mask("(99) 9 9999-9999").focusout(updatePhoneMask);
$("#cliente_telefone").mask("(99) 9 9999-9999").focusout(updatePhoneMask);
