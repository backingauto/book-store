<?php
include '../security.php';

if (!isset($_GET["id"])) {
    echo json_encode(["success" => false, "error" => "Missing book ID"]);
    exit();
}

try {
    $bookID = $_GET["id"];
    $userEmail = validate_auth_token($conn);

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
    $stmt->close();

    //check wishlist status
    $wishlistQuery = "SELECT wishlist FROM users WHERE email = ?";
    $stmt = $conn->prepare($wishlistQuery);
    $stmt->bind_param("s", $userEmail);
    $stmt->execute();
    $wishlistResult = $stmt->get_result();
    $userWishlist = $wishlistResult->fetch_assoc();
    $stmt->close();

    $isWishlist = false;
    if ($userWishlist && !empty($userWishlist["wishlist"])) {
        $wishlistArray = explode(",", $userWishlist['wishlist']); //string to array
        $isWishlist = in_array($bookID, $wishlistArray);
    }


    echo json_encode(["success" => true, "book" => $book, "isWishlist" => $isWishlist]);

} catch (Exception $e) {
    $response = ["success" => false, "error" => $e->getMessage()];
    echo json_encode($response);
    exit();
}

$conn->close();
?>