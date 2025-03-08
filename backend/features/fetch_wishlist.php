<?php
include '../security.php';

try {

    $user_email = validate_auth_token($conn);

    $query = "SELECT wishlist FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $userData = $result->fetch_assoc();
    $stmt->close();

    $wishlist = [];
    if ($userData && !empty($userData["wishlist"])) {
        $wishlistArray = explode(",", $userData["wishlist"]);

        $placeholders = implode(',', array_fill(0, count($wishlistArray), '?'));
        $query = "SELECT id, title, author, price FROM books WHERE id IN ($placeholders)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param(str_repeat('i', count($wishlistArray)), ...$wishlistArray);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $wishlist[] = $row;
        }
        $stmt->close();
    }

    echo json_encode(["success" => true, "wishlist" => $wishlist]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>