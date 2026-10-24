
<?php
include '../security.php';

try {
    $userEmail = validate_auth_token($conn);

    //get current account
    $query = "SELECT id, username, email, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $userEmail);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$user) {
        throw new Exception("Account not found");
    }

    //fetch account info
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        echo json_encode([
            "success" => true,
            "username" => $user["username"],
            "email" => $user["email"]
        ]);
        exit();
    }

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Invalid request"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data["action"] ?? "";
    $currentPassword = $data["currentPassword"] ?? "";

    if (!password_verify($currentPassword, $user["password"])) {
        echo json_encode(["success" => false, "message" => "Incorrect current password"]);
        exit();
    }

    //update username and email
    if ($action === "updateDetails") {
        $username = trim($data["username"] ?? "");
        $email = trim($data["email"] ?? "");

        if ($username === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "message" => "Invalid username or email"]);
            exit();
        }

        //check duplicates
        $query = "SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssi", $username, $email, $user["id"]);
        $stmt->execute();
        $exists = $stmt->get_result()->num_rows > 0;
        $stmt->close();

        if ($exists) {
            echo json_encode(["success" => false, "message" => "Username or email already exists"]);
            exit();
        }

        $conn->begin_transaction();

        try {
            $query = "UPDATE users SET username = ?, email = ? WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ssi", $username, $email, $user["id"]);
            $stmt->execute();
            $stmt->close();

            //keep records linked to the updated email
            if ($email !== $userEmail) {
                $tables = [
                    ["books", "seller_email"],
                    ["purchase_history", "email"],
                    ["book_reviews", "user_email"]
                ];

                for ($i = 0; $i < count($tables); $i++) {
                    $table = $tables[$i][0];
                    $column = $tables[$i][1];

                    $query = "UPDATE $table SET $column = ? WHERE $column = ?";
                    $stmt = $conn->prepare($query);
                    $stmt->bind_param("ss", $email, $userEmail);
                    $stmt->execute();
                    $stmt->close();
                }
            }

            $conn->commit();

            echo json_encode(["success" => true, "message" => "Account updated successfully"]);
        } catch (Throwable $e) {
            $conn->rollback();
            throw $e;
        }

    //change password
    } elseif ($action === "changePassword") {
        $newPassword = $data["newPassword"] ?? "";

        if (strlen($newPassword) < 8) {
            echo json_encode(["success" => false, "message" => "Password must be at least 8 characters"]);
            exit();
        }

        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $query = "UPDATE users SET password = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $hashedPassword, $user["id"]);
        $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => true, "message" => "Password changed successfully"]);

    } else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to update account"]);
}

$conn->close();
?>
