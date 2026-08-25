function validateform(event) {
    const form = event.currentTarget;
    const name = document.getElementById("name").value.trim();
    const rollno = document.getElementById("rollno").value.trim();
    const fatherName = document.getElementById("f_name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const gender = form.querySelector('input[name="Gender"]:checked');
    const dob = document.getElementById("dob").value;
    const branch = document.getElementById("branch-select").value;
    const address = document.getElementById("address").value.trim();
    const memo = document.getElementById("memo10").files[0];

    if (!name || !rollno || !fatherName || !phone || !email || !password || !gender || !dob || !branch || !address || !memo) {
        alert("Please complete all registration fields.");
        event.preventDefault();
        return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10 digit phone number.");
        event.preventDefault();
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        event.preventDefault();
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        event.preventDefault();
        return false;
    }

    const allowedMemoTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedMemoTypes.includes(memo.type)) {
        alert("Please upload a PDF or image file for the 10th memo.");
        event.preventDefault();
        return false;
    }

    return true;
}


document.querySelector("form").addEventListener("submit", function(event) {
    if (validateform(event)) {
        alert("Form submitted successfully!");      
    }
});