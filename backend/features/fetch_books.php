<?php
include '../security.php';

try {
    $query = "SELECT id, title, author, price, image_url FROM books ORDER BY id DESC";
    $result = $conn->query($query);

    $books = [];
    while ($book = $result->fetch_assoc()) {
        $books[] = $book;
    }

    $response = ["success" => true, "books" => $books];
    echo json_encode($response);

} catch (Exception $e) {
    $response = ["success" => false, "error" => $e->getMessage()];
    echo json_encode($response);
    exit();
}

$conn->close();
?>