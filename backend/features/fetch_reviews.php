<?php
include '../security.php';

try {

    $user_email = validate_auth_token($conn);

    $query = "SELECT 
            r.id AS review_id, 
            r.rating, 
            r.review, 
            r.time, 
            b.id AS book_id, 
            b.title, 
            b.author 
        FROM book_reviews r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_email = ?
        ORDER BY r.time DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $reviewData = $stmt->get_result();
    $reviews = $reviewData->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    echo json_encode(["success" => true, "reviews" => $reviews]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>