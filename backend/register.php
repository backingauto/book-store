<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: *");

$host = "localhost";
$user = "root";
$password = "";
$db = "bookstore_db";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);
if ($data == null) {
    echo json_encode(["success" => false, "message" => "missing input data"]);
    exit();
}

$username = $data["username"];
$email = $data["email"];
$password = $data["password"];

// check if empty
if (empty($username)) {
    echo json_encode(["success"=>false, "message"=>"Username is empty"]);
    exit();
} elseif(empty($email)) {
    echo json_encode(["success"=>false, "message"=>"Email is empty"]);
    exit();
} elseif(empty($password)) {
    echo json_encode(["success"=>false, "message"=>"Password is empty"]);
    exit();
}

$salt = bin2hex(random_bytes(16));
$hashedPassword = password_hash($salt . $password, PASSWORD_BCRYPT);

//check if email or username already existed
$query = "SELECT id FROM users WHERE email = ? OR username = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "username or email already existed"]);
    exit();
}

// insert new user into database
$query = "INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $username, $email, $hashedPassword, $salt);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Error registering user"]);
}

$stmt->close();
$conn->close();
?>