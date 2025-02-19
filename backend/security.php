<?php
include '../db_connection.php';

header("Content-Type: application/json");

function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

//return email from users
function validate_auth_token($conn) {
    if (!isset($_COOKIE["auth_token"])) {
        echo json_encode(["success" => false, "error" => "no auth token"]);
        exit();
    }

    $auth_token = $_COOKIE["auth_token"];

    $stmt = $conn->prepare("SELECT email FROM users WHERE auth_token = ?");
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 0) {
        echo json_encode(["success" => false, "error" => "no auth token in db"]);
        exit();
    }

    $user = $result->fetch_assoc();
    return $user["email"];
}

?>