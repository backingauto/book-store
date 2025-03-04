<?php
include '../security.php';

if (!isset($_GET["id"])) {
    echo json_encode(["success" => false, "error" => "Missing book ID"]);
    exit();
}

try {
    $bookID = $_GET["id"];

    $query = "SELECT id, title, author, price, description, image_url FROM books WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $bookID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Book not found"]);
        exit();
    }

    $book = $result->fetch_assoc();
    echo json_encode(["success" => true, "book" => $book]);

} catch (Exception $e) {
    $response = ["success" => false, "error" => $e->getMessage()];
    echo json_encode($response);
    exit();
}

$stmt->close();
$conn->close();
?>