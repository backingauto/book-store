<?php
include '../security.php';

try {
    $user_email = validate_auth_token($conn);

    $query = "SELECT shopping_cart FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $userData = $result->fetch_assoc();
    $stmt->close();

    $shoppingCart = [];

    //fetch data for each book
    if ($userData && !empty($userData["shopping_cart"])) {
        $shoppingCartArray = explode(",", $userData["shopping_cart"]);

        $bookCounts = array_count_values($shoppingCartArray);

        $placeholders = implode(',', array_fill(0, count($bookCounts), '?'));
        $query = "SELECT id, title, author, price FROM books WHERE id IN ($placeholders)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param(str_repeat('i', count($bookCounts)), ...array_keys($bookCounts));
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $row["quantity"] = $bookCounts[$row["id"]];
            $shoppingCart[] = $row;
        }
        $stmt->close();
    }

    echo json_encode(["success" => true, "shoppingCart" => $shoppingCart]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>
