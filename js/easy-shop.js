const numberPattern = /^[0-9]+$/;
const inCartAmountInfo = document.querySelector('.e-shop-incart');
let productCards = document.querySelectorAll('.e-shop-card');
let cart = document.querySelector('.e-shop-cart');

updateCartAmountInfo()

for (const card of productCards) {
  card.addEventListener('click', addToCart)
}

function addToCart(e) {
  if (e.target.classList.contains('e-shop-add')) {
    e.preventDefault();
    const card = e.currentTarget;
    let title, price, image, good, goods;

    if (card.querySelector('.e-shop-title')) {
      title = card.querySelector('.e-shop-title').innerText;
    } else {
      return;
    }

    if (card.querySelector('.e-shop-price')) {
      price = Number(
        card.querySelector('.e-shop-price')
          .innerText
          .replace(',', '.')
          .replace(/[^0-9\.]*/g, '')
          .replace(/^[\.]?/, '')
          .replace(/[\.]?$/, '')
      );
    } else {
      return;
    }

    image = card.querySelector('.e-shop-image').src;

    good = {
      'title': title.replace(/[\n]*/g, ''),
      'price': price,
      'image': image,
      'amount': 1
    };

    if (!localStorage.easyCart) {
      goods = [good];

    } else {
      goods = JSON.parse(localStorage.easyCart);

      let indexArr = goods.findIndex(function (savedGood) {
        return savedGood.title === good.title;
      });

      if (indexArr === -1) {
        goods.push(good);

      } else {
        goods[indexArr].amount += 1;
      }
    }
    localStorage.easyCart = JSON.stringify(goods);
    updateCartAmountInfo();
  }
}

function updateCartAmountInfo() {
  if (inCartAmountInfo) {
    if (localStorage.easyCart === undefined || JSON.parse(localStorage.easyCart).length === 0) {
      inCartAmountInfo.innerText = '';

    } else if (localStorage.easyCart) {
      const goodsList = JSON.parse(localStorage.easyCart);
      let counter = Array.from(goodsList).reduce(function (result, currentGood) {
        return result += Number(currentGood.amount);
      }, 0);

      inCartAmountInfo.innerText = `(${counter})`;
    }
  } else {
    return;
  }
}

function makeCartTable() {
  const goodsList = JSON.parse(localStorage.easyCart);
  const table = document.createElement('table');
  const tableRow = document.createElement('tr');
  const tableData = document.createElement('td');

  const tableHeaders = tableRow.cloneNode();
  const titleHeader = tableData.cloneNode();
  const amountHeader = tableData.cloneNode();
  const priceHeader = tableData.cloneNode();

  const tableFooter = tableRow.cloneNode();
  const tableFooterLable = tableData.cloneNode();
  const tableFooterTotalPrice = tableData.cloneNode();

  const cartData = document.createElement('input');
  cartData.type = 'hidden';
  cartData.name = 'cart-json-data';
  cartData.classList.add('cart-json');

  tableFooterLable.innerText = 'Итог: ';
  tableFooterTotalPrice.classList.add('total-price');

  titleHeader.innerText = 'Наименование';
  amountHeader.innerText = 'Количество';
  priceHeader.innerText = 'Сумма';

  tableHeaders.appendChild(tableData.cloneNode());
  tableHeaders.appendChild(titleHeader);
  tableHeaders.appendChild(amountHeader);
  tableHeaders.appendChild(priceHeader);

  table.appendChild(tableHeaders);
  tableData.style.verticalAlign = 'middle';

  for (const good of goodsList) {
    table.appendChild(putGoodInTable(good));
  }

  tableFooter.appendChild(tableData.cloneNode());
  tableFooter.appendChild(tableData.cloneNode());
  tableFooter.appendChild(tableFooterLable);
  tableFooter.appendChild(tableFooterTotalPrice);
  table.appendChild(tableFooter);
  table.appendChild(cartData);

  function putGoodInTable(good) {
    const goodRow = tableRow.cloneNode();
    const img = document.createElement('img');
    const imgData = tableData.cloneNode();
    const title = tableData.cloneNode();
    const amount = tableData.cloneNode();
    const amountInput = document.createElement('input');
    const price = tableData.cloneNode();
    const deleteData = tableData.cloneNode();

    const button = document.createElement('a');
    button.style.width = '18px';
    button.style.height = '18px';
    button.style.border = '1px solid #aeaeae';
    button.style.borderRadius = '100%';
    button.style.textAlign = 'center';
    button.style.display = 'inline-block';
    button.style.fontSize = '20px';
    button.style.lineHeight = '15px';
    button.style.verticalAlign = 'middle';
    button.style.margin = '0 5px';
    button.href = '#';

    const buttonDec = button.cloneNode();
    const buttonInc = button.cloneNode();
    const deleteBtn = button.cloneNode();

    img.src = good.image;
    imgData.dataset.name = 'image';
    imgData.appendChild(img);

    title.textContent = good.title;
    title.dataset.name = 'title';

    amountInput.type = 'text';
    amountInput.value = good.amount;
    amountInput.style.width = '20px';
    amountInput.style.height = '15px';
    amountInput.style.textAlign = 'center';

    buttonDec.style.color = 'red';
    buttonDec.classList.add('dec');
    buttonDec.textContent = '-';

    buttonInc.style.color = 'green';
    buttonInc.classList.add('inc');
    buttonInc.textContent = '+';

    amount.dataset.name = 'amount';

    amount.appendChild(buttonDec);
    amount.appendChild(amountInput);
    amount.appendChild(buttonInc);

    price.textContent = (good.price * good.amount).toFixed(2);
    price.dataset.name = 'price';

    deleteBtn.classList.add('delete-good');
    deleteBtn.innerHTML = '&#215;';
    deleteBtn.title = 'Удалить товар';
    deleteBtn.style.fontSize = '24px';
    deleteBtn.style.color = 'red';
    deleteData.appendChild(deleteBtn);

    goodRow.appendChild(imgData);
    goodRow.appendChild(title);
    goodRow.appendChild(amount);
    goodRow.appendChild(price);
    goodRow.appendChild(deleteData);

    return goodRow;
  }

  table.style.width = '100%';

  return table;
}

if (cart) {
  if (localStorage.easyCart === undefined || localStorage.easyCart === '[]') {
    cart.innerHTML = '<p>Корзина пуста</p>';

  } else {
    cart.insertBefore(makeCartTable(), cart.firstElementChild);

    changeTotalPrice();
    const cartItemsList = cart.querySelectorAll('tr');

    for (const cartItem of cartItemsList) {
      cartItem.addEventListener('click', changeGoodAmount);
      cartItem.addEventListener('input', changeGoodAmount);
    }

    cart.addEventListener('submit', clearCart);

    function changeGoodAmount(event) {
      if (event.target.classList.contains('inc') || event.target.classList.contains('dec')) {
        event.preventDefault();
        const amountField = event.currentTarget.querySelector('input');

        if (event.target.classList.contains('inc')) {
          amountField.value = ++amountField.value;

        } else {
          if (amountField.value > 1) {
            amountField.value = --amountField.value;
          }
        }
        changeGoodAmountAndTotalPrice(event.currentTarget);

      } else if (event.target.tagName === 'INPUT' && event.type === 'input') {
        const currentValue = event.target.value;

        if (!numberPattern.test(currentValue)) {
          event.target.value = currentValue.slice(0, currentValue.length - 1)
        }
        if (currentValue === '' || isNaN(parseInt(event.target.value))) {
          event.target.value = 1;
        }
        changeGoodAmountAndTotalPrice(event.currentTarget);

      } else if (event.target.classList.contains('delete-good')) {
        event.preventDefault();

        const goodTitle = event.currentTarget.querySelector('[data-name="title"]').textContent;
        removeGoodFromStorage(goodTitle);
        event.currentTarget.remove();
        changeTotalPrice();

        if (JSON.parse(localStorage.easyCart).length === 0) {
          cart.innerHTML = '<p>Корзина пуста</p>';

        }
      }
    }

    function changeGoodAmountAndTotalPrice(goodNode) {
      const goodTitle = goodNode.querySelector('[data-name="title"]').textContent;
      const goodAmount = goodNode.querySelector('input').value;
      const goodPriceNode = goodNode.querySelector('[data-name="price"]');
      const goodsList = JSON.parse(localStorage.easyCart);
      const thatGood = goodsList.find(good => good.title === goodTitle);

      thatGood.amount = goodAmount;
      goodPriceNode.textContent = (thatGood.amount * thatGood.price).toFixed(2);

      localStorage.easyCart = JSON.stringify(goodsList);
      changeTotalPrice();
      updateCartAmountInfo();
    }

    function changeTotalPrice() {
      const prices = cart.querySelectorAll('[data-name="price"]');
      const totalPrice = cart.querySelector('.total-price');
      let counter = Array.from(prices).reduce(function (result, currentGood) {
        return result += Number(currentGood.innerText);
      }, 0);

      totalPrice.innerText = counter.toFixed(2);
      setInputDataJSON();
    }

    function removeGoodFromStorage(title) {
      const goodsList = JSON.parse(localStorage.easyCart);
      const thatGoodIndex = goodsList.findIndex(good => good.title === title);

      goodsList.splice(thatGoodIndex, 1);
      localStorage.easyCart = JSON.stringify(goodsList);
      changeTotalPrice();
      updateCartAmountInfo();
    }

    function setInputDataJSON() {
      const dataContainer = cart.querySelector('.cart-json');
      dataContainer.value = localStorage.easyCart;
    }

    function clearCart() {
      localStorage.removeItem('easyCart');
    }
  }
}