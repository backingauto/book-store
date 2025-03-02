<?php
include '../security.php';

$seller_email = validate_auth_token($conn);

try {
    $title = sanitize_input($_POST["title"]);
    $author = sanitize_input($_POST["author"]);
    $genre = sanitize_input($_POST["genre"]);
    $price = sanitize_input($_POST["price"]);
    if ($price <= 0) {
        echo json_encode(["success" => false, "error" => "invalid price"]);
        exit();
    }

    $stock = sanitize_input($_POST["stock"]);
    if ($stock <= 0) {
        echo json_encode(["success" => false, "error" => "invalid stock"]);
        exit();
    }

    $description = sanitize_input($_POST["description"]);

    $cover = $_FILES["cover"];
    $cover_name = sanitize_input($cover["name"]);
    
    $allowed_extension = ["jpg", "jpeg", "png"];
    $cover_extension = pathinfo($cover_name, PATHINFO_EXTENSION);
    if (!in_array($cover_extension, $allowed_extension)) {
        echo json_encode(["success" => false, "error" => "invalid file type"]);
        exit();
    }

    //move the cover image to the cover dir
    $temp_cover_name = uniqid("cover_") . "." . $cover_extension;
    $upload_directory = "../../cover/";
    $upload_path = $upload_directory . $temp_cover_name;
    
    if (!move_uploaded_file($cover["tmp_name"], $upload_path)) {
        echo json_encode(["success" => false, "error" => "File upload failed"]);
        exit();
    }

    $image_url = "http://localhost/book-store/cover/" . $temp_cover_name;

    $query = "INSERT INTO books (title, author, description, image_url, price, genre, stock, seller_email) VALUES (?,?,?,?,?,?,?,?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssdsis", $title, $author, $description, $image_url, $price, $genre, $stock, $seller_email);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Book added successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to insert into database"]);
    }

    $stmt->close();

} catch (Exception $e) {
    $response = ["success" => false, "error" => $e->getMessage()];
    echo json_encode($response);
    exit();
}

$conn->close();
?>