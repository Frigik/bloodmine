var selectedCategory = 'ranks';
var selectedIndex = 1;
var selectedTerm = 'На месяц';
var termMultiplier = { 'На месяц': 1, 'Навсегда': 3 };
var lastFocused = null;
var products = {
  ranks: [
    {name: 'Цербер', price: 14}, {name: 'Маркиз', price: 39}, {name: 'Граф', price: 59},
    {name: 'Орион', price: 99}, {name: 'Визирь', price: 149}, {name: 'Феникс', price: 239},
    {name: 'Рыцарь', price: 329}, {name: 'Правитель', price: 529}, {name: 'Властелин', price: 879}, {name: 'Император', price: 1299}
  ],
  cases: [{name: 'Стартовый кейс',price: 19},{name: 'Кейс исследователя',price: 49},{name: 'Кейс героя',price: 99},{name: 'Коллекция сезона',price: 149}],
  shards: [{name: '100 осколков',price: 29},{name: '300 осколков',price: 69},{name: '700 осколков',price: 129},{name: '1500 осколков',price: 249}],
  other: [{name: 'Цветной ник',price: 29},{name: 'Эффект появления',price: 49},{name: 'Набор эмоций',price: 79}]
};

function renderProducts() {
  var list = document.getElementById('product-list');
  if (!list) return;
  list.textContent = '';
  products[selectedCategory].forEach(function(item, index) {
    var row = document.createElement('button');
    row.type = 'button';
    row.className = 'product-row' + (index === selectedIndex ? ' chosen' : '');
    row.setAttribute('aria-pressed', index === selectedIndex ? 'true' : 'false');
    var name = document.createElement('span');
    name.textContent = item.name;
    var price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = 'от ' + item.price + ' ₽ ›';
    row.appendChild(name);
    row.appendChild(price);
    row.addEventListener('click', function() { selectedIndex = index; renderProducts(); });
    list.appendChild(row);
  });
  var product = products[selectedCategory][selectedIndex];
  document.getElementById('preview-name').textContent = product.name;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('preview-image').src = selectedCategory === 'cases' ? 'assets/images/chest.webp' : 'assets/images/player.webp';
  var details = selectedCategory === 'ranks'
    ? '<li>Название в чате — <span>' + product.name + '</span></li><li>Оформление профиля — <span>цвет и стиль</span></li><li>Дополнительный набор — <span>предметы</span></li><li>Коллекция эффектов — <span>для персонажа</span></li>'
    : '<li>Выбранный набор — <span>' + product.name + '</span></li><li>Описание игровой коллекции</li><li>Содержимое можно посмотреть в каталоге</li>';
  document.getElementById('product-description').innerHTML = '<ul>' + details + '</ul>';
  updatePrice();
}

function updatePrice() {
  var button = document.getElementById('choose-product');
  if (!button) return;
  var product = products[selectedCategory][selectedIndex];
  var total = product.price * termMultiplier[selectedTerm];
  button.textContent = selectedTerm === 'Навсегда'
    ? 'Выбрать за ' + total + ' ₽ навсегда'
    : 'Выбрать за ' + total + ' ₽';
}

function setCategory(category) {
  selectedCategory = category;
  selectedIndex = 0;
  document.querySelectorAll('.tab').forEach(function(tab) {
    var active = tab.getAttribute('data-category') === category;
    tab.className = 'tab' + (active ? ' active' : '');
    tab.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  renderProducts();
}

function setTerm(element, term) {
  selectedTerm = term;
  document.querySelectorAll('.term').forEach(function(item) {
    var active = item === element;
    item.classList.toggle('selected', active);
    item.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  updatePrice();
}

function openDialog(title, text) {
  lastFocused = document.activeElement;
  document.getElementById('dialog-title').textContent = title;
  document.getElementById('dialog-text').textContent = text;
  var dialog = document.getElementById('dialog');
  dialog.classList.add('visible');
  var closeButton = dialog.querySelector('.modal-close');
  if (closeButton) closeButton.focus();
}

function closeDialog() {
  var dialog = document.getElementById('dialog');
  if (!dialog) return;
  dialog.classList.remove('visible');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  lastFocused = null;
}

function selectProduct() {
  var item = products[selectedCategory][selectedIndex];
  openDialog(item.name, 'Вы выбрали «' + item.name + '», срок: ' + selectedTerm.toLowerCase() + '. Это демонстрация каталога: оплата и выдача игровых товаров недоступны.');
}

function showReward(name) {
  openDialog(name, 'Пример награды «' + name + '». Здесь можно изучить оформление коллекции. Получение предметов на игровом сервере не подключено.');
}

function toggleRule(element) {
  var rule = element.parentNode;
  rule.classList.toggle('open');
  var opened = rule.classList.contains('open');
  element.querySelector('b').textContent = opened ? '−' : '+';
  element.setAttribute('aria-expanded', opened ? 'true' : 'false');
}

function trapFocus(event) {
  var dialog = document.getElementById('dialog');
  if (!dialog || !dialog.classList.contains('visible')) return;
  if (event.key === 'Escape') { closeDialog(); return; }
  if (event.key !== 'Tab') return;
  var focusables = dialog.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  var first = focusables[0];
  var last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

renderProducts();
document.addEventListener('keydown', trapFocus);
document.getElementById('dialog').addEventListener('click', function(event) { if (event.target === this) closeDialog(); });
