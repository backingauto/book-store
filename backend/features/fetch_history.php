<?php
include '../security.php';

try {

    $user_email = validate_auth_token($conn);

    $historyQuery = "SELECT shopping_cart, time, price FROM purchase_history WHERE email = ?";
    $stmt = $conn->prepare($historyQuery);
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    //get all record
    $purchaseHistory = [];
    while ($row = $result->fetch_assoc()) {
        $bookIdArray = explode(",", $row["shopping_cart"]);
        $bookCounts = array_count_values($bookIdArray);
        $bookTitles = [];

        if (!empty($bookCounts)) {
            $placeholders = implode(',', array_fill(0, count($bookCounts), '?'));

            $bookQuery = "SELECT id, title FROM books WHERE id IN ($placeholders)"; //count how many different books
            $stmtBooks = $conn->prepare($bookQuery);
            
            $stmtBooks->bind_param(str_repeat('i', count($bookCounts)), ...array_keys($bookCounts)); //unpack the array
            $stmtBooks->execute();
            $booksResult = $stmtBooks->get_result();

            //find the quantity for each book
            while ($book = $booksResult->fetch_assoc()) {
                $bookTitle = $book["title"];
                $quantity = $bookCounts[$book["id"]];
                $bookTitles[] = "$bookTitle x $quantity ";
            }
            $stmtBooks->close();
        }
        
        $purchaseHistory[] = [
            "books" => implode(", ", $bookTitles),
            "time" => $row["time"],
            "price" => $row["price"]
        ];
    }

    $stmt->close();


    echo json_encode(["success" => true, "purchaseHistory" => $purchaseHistory]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close();
?>