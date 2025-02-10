<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");

include '../db_connection.php';

if (!isset($_COOKIE["auth_token"])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit();
}

$auth_token = $_COOKIE["auth_token"];

// Verify token exists in database
$query = "SELECT id, username FROM users WHERE auth_token = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Invalid session"]);
    exit();
}

$stmt->bind_result($id, $username);
$stmt->fetch();

echo json_encode(["success" => true, "message" => "Authenticated", "user" => ["id" => $id, "username" => $username]]);

$stmt->close();
$conn->close();
?>
