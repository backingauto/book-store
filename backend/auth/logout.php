<?php
include '../security.php';

//check if auth_token exsits
if (isset($_COOKIE["auth_token"])) {
    $auth_token = $_COOKIE["auth_token"];

    //remove it from the db
    $query = "UPDATE users SET auth_token = NULL WHERE auth_token = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $stmt->close();

    //expire the cookie
    setcookie("auth_token", "", time()-86400, "/");
}

echo json_encode(["success" => true, "message" => "logout successfully"]);

$conn->close();
?>