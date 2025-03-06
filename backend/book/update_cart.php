<?php
include '../security.php';

try {

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["bookId"])) {
        echo json_encode(["success" => false, "error" => "Missing bookId"]);
        exit();
    }
    if (!isset($data["action"])) {
        echo json_encode(["success" => false, "error" => "Missing action"]);
        exit();
    }

    $userEmail = validate_auth_token($conn);
    $bookID = $data["bookId"];
    $action = $data["action"];

    $shoppingCartQuery = "SELECT shopping_cart FROM users WHERE email = ?";
    $stmt = $conn->prepare($shoppingCartQuery);
    $stmt->bind_param("s", $userEmail);
    $stmt->execute();
    $shoppingCartResult = $stmt->get_result();
    $shoppingCartStr = $shoppingCartResult->fetch_assoc();
    $stmt->close();

    //string to array
    $shoppingCartArray = [];
    if ($shoppingCartStr && !empty($shoppingCartStr["shopping_cart"])) {
        $shoppingCartArray = explode(",", $shoppingCartStr["shopping_cart"]);
    }

    //add 1 book to shopping_cart
    if ($action === "add") {
        $shoppingCartArray[] = $bookID;
    }
    //remove 1 book from shopping_cart
    elseif ($action === "remove") {
        $key = array_search($bookID, $shoppingCartArray);
        if ($key !== false) {
            unset($shoppingCartArray[$key]);
        }
    }

    $updatedShoppingCart = implode(",", $shoppingCartArray);

    $updateCartQuery = "UPDATE users SET shopping_cart = ? WHERE email = ?";
    $stmt = $conn->prepare($updateCartQuery);
    $stmt->bind_param("ss", $updatedShoppingCart, $userEmail);
    $stmt->execute();
    $stmt->close();

    $inShoppingCart = 0;
    $counts = array_count_values($shoppingCartArray);
    $inShoppingCart = $counts[$bookID] ?? 0;

    echo json_encode(["success" => true, "inShoppingCart" => $inShoppingCart]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

?>