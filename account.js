document.addEventListener("DOMContentLoaded", function () {
    const saveAccountChangesButton = document.getElementById("saveAccountChangesButton");
    const editUsernameInput = document.getElementById("editUsername");
    const editEmailInput = document.getElementById("editEmail");

    const savePasswordButton = document.getElementById("savePasswordButton");
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Populate the Edit Account modal with current username and email
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");

    usernameInput.addEventListener("click", function () {
        editUsernameInput.value = usernameInput.value;
        editEmailInput.value = emailInput.value;
    });

    // Save the updated username and email
    saveAccountChangesButton.addEventListener("click", function () {
        const updatedUsername = editUsernameInput.value.trim();
        const updatedEmail = editEmailInput.value.trim();

        if (updatedUsername && updatedEmail) {
            // Here, you would make an API call to save the username and email
            console.log("Updated username:", updatedUsername);
            console.log("Updated email:", updatedEmail);
            alert("Account details updated successfully!");
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Password change functionality
    savePasswordButton.addEventListener("click", function () {
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill out all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        // Here, you would make an API call to change the password
        console.log("Current password:", currentPassword);
        console.log("New password:", newPassword);
        alert("Password changed successfully!");
    });
});
