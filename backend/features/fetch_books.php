<?php
include '../security.php';

try {

    $location = $_GET["location"] ?? "homepage";
    $purpose = $_GET["purpose"] ?? "all"; #null to avoid when no book

    if ($location === "landingPage") {
        $page = max(1, intval($_GET["page"] ?? 1));
        $limit = 5;
        $offset = ($page - 1) * $limit;

        if ($purpose === "bestSeller") {
            $query = "SELECT id, title, author, price, image_url, rating FROM books ORDER BY sold DESC LIMIT $offset, $limit";
        } elseif ($purpose === "newBooks") {
            $query = "SELECT id, title, author, price, image_url, rating FROM books ORDER BY created_at DESC LIMIT $offset, $limit";
        } else {
            echo json_encode(["success" => false, "error" => "unknown landing page purpose"]);
            exit();
        }

    } elseif ($location === "homepage") {
        $query = "SELECT id, title, author, price, image_url FROM books ORDER BY id DESC";
    } else {
        echo json_encode(["success" => false, "error" => "unknown location"]);
        exit();
    }
 
    
    $result = $conn->query($query);
    $books = $result->fetch_all(MYSQLI_ASSOC);

    $response = ["success" => true, "books" => $books];
    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>