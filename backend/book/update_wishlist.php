<?php
include '../security.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["bookId"])) {
    echo json_encode(["success" => false, "error" => "Missing book ID"]);
    exit();
}

$bookID = intval($data["bookId"]);
$user_email = validate_auth_token($conn);

try {
    $query = "SELECT wishlist FROM users where email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $wishlistData = $result->fetch_assoc();
    $stmt->close();

    $wishlistArray = [];
    if ($wishlistData && !empty($wishlistData["wishlist"])) {
        $wishlistArray = explode(",", $wishlistData["wishlist"]); //string to array
    }

    //remove from wishlist
    if (in_array($bookID, $wishlistArray)) {
        $wishlistArray = array_diff($wishlistArray, [$bookID]);
        $wishlisted = false;
    } else {
        //add to wishlist
        $wishlistArray[] = $bookID;
        $wishlisted = true;
    }

    //array to string
    $updatedWishlist = implode(",", $wishlistArray);

    //update db
    $updateQuery = "UPDATE users SET wishlist = ? WHERE email = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("ss", $updatedWishlist, $user_email);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(["success" => true, "wishlisted" => $wishlisted]);

} catch (Exception $error) {
    echo json_encode(["success:" => false, "error:" => $error.getMessage()]);
    exit();
}
?>