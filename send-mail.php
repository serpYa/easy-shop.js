<?php
// Обрабатываем полученные поля формы
$name = $_POST["name"];
$phone = $_POST["phone"];
$email = $_POST["email"];

// Принимаем JSON объект из нашей корзины и обрабатываем его
// Имя инпута 'cart-json-data' генерируется библиотекой
$data_json = $_POST['cart-json-data'];
$data_json = json_decode($data_json, true);
$order_html = "<table><tbody>";
$order_total_price = 0;

// Формируем таблицу с заказанными товарами для вставки в письмо
foreach($data_json as $good) {
  $order_html .= "
  <tr>
    <td>Название товара: </td>
    <td>{$good["title"]}</td>
  </tr>
  <tr>
    <td>Количество: </td>
    <td>{$good["amount"]}</td>
  </tr>
  <tr>
    <td>Стоимость: </td>
    <td>" . ($good['price'] * $good['amount']) . "</td>
  </tr>
  ";
  $order_total_price += ($good['price'] * $good['amount']);
}

$order_html .= "
  <tr>
    <td>Итого: </td>
    <td>{$order_total_price}</td>
  </tr>
";
$order_html .= "</tbody></table>";

// Тут указываем на какой ящик посылать письмо
$to = "sergei.kundryukov1989@yandex.ru";

// Указываем тему письма
$subject = "Заявка с сайта";

// Тело письма (сообщение целиком)
$message = "
Имя пользователя: " . htmlspecialchars($name) . "<br>
Телефон: <a href='tel:$phone'>" . htmlspecialchars($phone) . "</a><br>
Email: " . htmlspecialchars($email) . "<br>
{$order_html}";

// Формируем заголовок запроса
$headers = "From: easy-shop <order@easy-shop.js>\r\nContent-type: text/html; charset=UTF-8 \r\n";

// Отправляем письмо при помощи функции mail();
mail($to, $subject, $message, $headers);

// Перенаправляем человека на страницу благодарности и завершаем скрипт
header('Location: ./thanks.html');
exit();

?>