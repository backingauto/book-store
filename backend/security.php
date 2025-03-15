<?php
include '../db_connection.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

//return user email from auth_token
function validate_auth_token($conn) {
    if (!isset($_COOKIE["auth_token"])) {
        http_response_code(401);
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