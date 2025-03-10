<?php
include '../security.php';

try {
    $user_email = validate_auth_token($conn);

    $query = "SELECT id, title, author, price, stock, sold FROM books WHERE seller_email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();

    $sellingBooks = [];
    while ($row = $result->fetch_assoc()) {
        $sellingBooks[] = $row;
    }
    $stmt->close();

    echo json_encode(["success" => true, "sellingBooks" => $sellingBooks]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>