<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


include '../db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);
if ($data == null) {
    echo json_encode(["success" => false, "message" => "missing input data"]);
    exit();
}

$usernameOrEmail = $data["usernameOrEmail"];
$password = $data["password"];

if (empty($usernameOrEmail)) {
    echo json_encode(["success"=>false, "message"=>"Username or email is empty"]);
    exit();
} elseif(empty($password)) {
    echo json_encode(["success"=>false, "message"=>"password is empty"]);
    exit();
}

//check if the user exsits
$query = "SELECT id, username, email, password, salt FROM users WHERE username = ? OR email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $usernameOrEmail, $usernameOrEmail); //replace the ? (placeholder) with the variable(s)
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "user doesn't exsits"]);
    exit();
}

$stmt->bind_result($id, $username, $email, $hashedPassword, $salt);
$stmt->fetch();

//verify password
if (!password_verify($salt . $password, $hashedPassword)) {
    echo json_encode(["success"=>false, "message"=>"invalid password"]);
    exit();
}

//set auth token
$auth_token = bin2hex(random_bytes(16));

$query = "UPDATE users SET auth_token = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $auth_token, $id);
$stmt->execute();

//store auth_token in session
session_start();
$_SESSION["auth_token"] = $auth_token;

//success
echo json_encode(["success" => true, "message" => "Login successful", "user" => 
["id" => $id, "username" => $username, "email" => $email]]);

$stmt->close();
$conn->close();
?>