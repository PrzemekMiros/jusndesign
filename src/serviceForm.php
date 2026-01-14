<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("content-type: application/json; charset=utf-8");

// Pobieranie danych z formularza
$email = isset($_POST['visitor_email']) ? trim($_POST['visitor_email']) : "";
$name = isset($_POST['visitor_name']) ? trim($_POST['visitor_name']) : "";
$birth_year = isset($_POST['visitor_date']) ? trim($_POST['visitor_date']) : "";
$license_years = isset($_POST['visitor_autolicense']) ? trim($_POST['visitor_autolicense']) : "";
$car_model = isset($_POST['visitor_automodel']) ? trim($_POST['visitor_automodel']) : "";
$message = isset($_POST['visitor_msg']) ? trim($_POST['visitor_msg']) : "";
$consent = isset($_POST['visitor_consent']) ? $_POST['visitor_consent'] : "";
$newsletter = isset($_POST['visitor_newsletter']) ? $_POST['visitor_newsletter'] : "";

// Obsługa użytkowania samochodu 4x4
$usage_array = isset($_POST['visitor_usage']) ? $_POST['visitor_usage'] : array();
$usage_other = isset($_POST['visitor_usage_other']) ? trim($_POST['visitor_usage_other']) : "";
$usage_text = "";

if (!empty($usage_array)) {
    $usage_text = implode(", ", $usage_array);
    if (!empty($usage_other) && in_array("Inne", $usage_array)) {
        $usage_text = str_replace("Inne", "Inne: " . $usage_other, $usage_text);
    }
}

// Obsługa mediów społecznościowych
$social_array = isset($_POST['visitor_social']) ? $_POST['visitor_social'] : array();
$social_text = !empty($social_array) ? implode(", ", $social_array) : "Brak";

// Walidacja wymaganych pól
if(empty($email) || empty($name) || empty($license_years) || empty($car_model) || empty($consent) || empty($newsletter)) {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Proszę wypełnić wszystkie wymagane pola, w tym zgodę na newsletter.</p>");
    echo json_encode($json);
    exit;
}

// Walidacja email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Proszę podać prawidłowy adres email.</p>");
    echo json_encode($json);
    exit;
}

// Walidacja użytkowania samochodu
if (empty($usage_array)) {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Proszę wybrać przynajmniej jeden sposób korzystania z samochodu 4x4.</p>");
    echo json_encode($json);
    exit;
}

// Przygotowanie treści emaila
$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit";
$message_body = "=== FORMULARZ WSPÓŁPRACY Z ORE4x4 ===\n\n";
$message_body .= "Email: $email\n";
$message_body .= "Imię: $name\n";
$message_body .= "Rok urodzenia: $birth_year\n";
$message_body .= "Lata posiadania prawa jazdy: $license_years\n";
$message_body .= "Aktualny samochód: $car_model\n";
$message_body .= "Sposób użytkowania 4x4: $usage_text\n";
$message_body .= "Media społecznościowe: $social_text\n";
$message_body .= "Doświadczenie naprawcze: $message\n";
$message_body .= "Zgodne na przetwarzanie danych: " . ($consent ? "TAK" : "NIE") . "\n";
$message_body .= "Zgoda na newsletter: " . ($newsletter ? "TAK" : "NIE") . "\n";
$message_body .= "\nData wysłania: " . date('Y-m-d H:i:s') . "\n";
$message_body .= "\n--- UWAGA ---\n";
$message_body .= "Kontakt został automatycznie dodany do newslettera GetResponse przez Web Connect.\n";

// Wysyłanie emaila
$email_sent = mail("kontakt@przemekmiros.pl", "Formularz współpracy ORE4x4 - $name", $message_body, $headers);

// Zwracanie odpowiedzi
if ($email_sent) {
    $success_message = "Twój formularz został wysłany. Niedługo otrzymasz odpowiedź. Zostałeś również zapisany do newslettera z najnowszymi informacjami o współpracy.";
    $json = array("status" => 1, "msg" => "<p class='status_ok'>$success_message</p>");
} else {
    $json = array("status" => 0, "msg" => "<p class='status_err'>Wystąpił problem z wysłaniem formularza.</p>");
}

echo json_encode($json);
exit;
?>