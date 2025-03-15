<?php
include '../security.php';

try {

    $input = json_decode(file_get_contents("php://input"), true);
    $review_id = $input["reviewId"] ?? null;    

    $user_email = validate_auth_token($conn);

    $query = "DELETE FROM book_reviews WHERE id = ? AND user_email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("is", $review_id, $user_email);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "msg" => "Review has been deleted"]);
    } else {
        echo json_encode(["success" => false, "error" => "Review not found"]);
    }
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>