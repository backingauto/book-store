<?php
$host = "localhost";
$user = "root";
$password = "";
$db = "bookstore_db";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}
?>