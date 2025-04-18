<?php
include '../security.php';

try {

    $userEmail = validate_auth_token($conn);

    //fetch user's shopping cart
    $historyQuery = "SELECT shopping_cart FROM users WHERE email = ?";
    $stmt = $conn->prepare($historyQuery);
    $stmt->bind_param("s", $userEmail);
    $stmt->execute();
    $shoppingCartResult = $stmt->get_result();
    $shoppingCartData = $shoppingCartResult->fetch_assoc();
    $shoppingCartStr = $shoppingCartData["shopping_cart"];
    $stmt->close();

    if (!$shoppingCartData || empty($shoppingCartStr)) {
        echo json_encode(["success" => false, "error" => "shopping cart is empty"]);
        exit();
    }

    $shoppingCartArray = explode(",", $shoppingCartStr);
    $item_counts = array_count_values($shoppingCartArray);

    //check if all the books are avialbe
    foreach ($item_counts as $id => $quantity) {
        $stockQuery = "SELECT stock FROM books WHERE id = ?";
        $stmt = $conn->prepare($stockQuery);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($stock);
        $stmt->fetch();
        $stmt->close();

        if ($stock < $quantity) {
            echo json_encode(["success" => false, "error" => "Not enough stock for book ID $id. Available: $stock, Requested: $quantity"]);
            exit();
        }
    }

    //process checkout
    $total_price = 0;
    foreach($item_counts as $id => $quantity) {
        $priceQuery = "SELECT price FROM books WHERE id = ?";
        $stmt = $conn->prepare($priceQuery);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->bind_result($price);
        $stmt->fetch();
        $stmt->close();

        $total_price += $price * $quantity;

        //update stock and sold
        $updateStockQuery = "UPDATE books SET stock = stock - ?, sold = sold + ? WHERE id = ?";
        $stmt = $conn->prepare($updateStockQuery);
        $stmt->bind_param("iii", $quantity, $quantity, $id);
        $stmt->execute();
        $stmt->close();
    }

    $current_time = date('Y-m-d H:i:s');

    //insert into purchase_history table
    $insertQuery = "INSERT INTO purchase_history (email, shopping_cart, time, price) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($insertQuery);
    $stmt->bind_param("sssd", $userEmail, $shoppingCartStr, $current_time, $total_price);
    $stmt->execute();
    $stmt->close();

    //clear the user shopping_cart
    $clearQuery = "UPDATE users SET shopping_cart = '' WHERE email = ?";
    $stmt = $conn->prepare($clearQuery);
    $stmt->bind_param("s", $userEmail);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["success" => true, "total_price" => $total_price, "current_time" => $current_time, "shoppingCart" => $shoppingCartStr]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit();
}

$conn->close()
?>