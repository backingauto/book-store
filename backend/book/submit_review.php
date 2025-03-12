<?php
include '../security.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data == null) {
        echo json_encode(["success" => false, "message" => "missing input data"]);
        exit();
    }

    $review = sanitize_input($data["review"]);
    $rating = $data["rating"];
    $bookId = $data["bookId"];

    // check if empty
    if (empty($rating)) {
        echo json_encode(["success"=>false, "message"=>"Please give a rating."]);
        exit();
    } elseif(empty($review)) {
        echo json_encode(["success"=>false, "message"=>"Review can't be empty."]);
        exit();
    }

    $user_email = validate_auth_token($conn);

    // insert review into database
    $current_time = date('Y-m-d H:i:s');
    $reviewQuery = "INSERT INTO book_reviews (user_email, book_id, time, rating, review) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($reviewQuery);
    $stmt->bind_param("sisis", $user_email, $bookId, $current_time, $rating, $review);
    $stmt->execute();
    $stmt->close();

    //update book rating
    $updateRatingQuery = "UPDATE books SET rating = (SELECT AVG(rating) FROM book_reviews WHERE book_id = ?) WHERE id = ?";
    $stmt = $conn->prepare($updateRatingQuery);
    $stmt->bind_param("ii", $bookId, $bookId);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["success" => true, "message" => "Review submitted successfully."]);
    exit();

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>