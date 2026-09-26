// Get HTML elements

const addJobBtn = document.getElementById("addJobBtn");
const jobForm = document.getElementById("jobForm");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");

const saveJobBtn = document.getElementById("saveJobBtn");
const jobList = document.getElementById("jobList");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

// Dashboard

const totalJobs = document.getElementById("totalJobs");
const appliedJobs = document.getElementById("appliedJobs");
const interviewJobs = document.getElementById("interviewJobs");
const selectedJobs = document.getElementById("selectedJobs");

// Get saved jobs

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];


// Edit mode

let editIndex = -1;


// Show Add Job form

addJobBtn.addEventListener("click", function () {

    if (jobForm.style.display === "block") {

        jobForm.style.display = "none";

        addJobBtn.textContent = "+ Add Job";

    } else {

        jobForm.style.display = "block";

        addJobBtn.textContent = "✕ Close Form";

    }

});


// Save / Update Job

saveJobBtn.addEventListener("click", function () {

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;


    // Validation

    if (company === "" || role === "") {

        alert("Please enter company name and job role");

        return;

    }


    // Create job

    const job = {
        company: company,
        role: role,
        date: date,
        status: status
    };


    // Check Edit or Add

    if (editIndex === -1) {

        // Add new job

        jobs.push(job);

    } else {

        // Update existing job

        jobs[editIndex] = job;

        editIndex = -1;

    }


    // Save to localStorage

    localStorage.setItem("jobs", JSON.stringify(jobs));


    // Clear and refresh everything

    clearForm();

    displayJobs();

    updateDashboard();

});


// Display all jobs

function displayJobs() {

    jobList.innerHTML = "";


    if (jobs.length === 0) {

        jobList.innerHTML = `
            <div class="empty-message">
                <p>No job applications added yet.</p>
            </div>
        `;

        return;

    }


    jobs.forEach(function (job, index) {

        displayJob(job, index);

    });

}


// Display one job

function displayJob(job, index) {

    const jobCard = document.createElement("div");

    jobCard.classList.add("job-card");


    jobCard.innerHTML = `

    <h3>${job.company}</h3>

    <p>${job.role}</p>

    <p>📅 ${job.date || "Date not added"}</p>

    <span class="status-badge ${job.status.toLowerCase()}">
        ${job.status}
    </span>

    <div class="job-actions">

        <button class="edit-btn">Edit</button>

        <button class="delete-btn">Delete</button>

    </div>

`;


    jobList.appendChild(jobCard);


    // Delete button

    const deleteBtn = jobCard.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {

        jobs.splice(index, 1);

        localStorage.setItem("jobs", JSON.stringify(jobs));

        displayJobs();

        updateDashboard();

    });


    // Edit button

    const editBtn = jobCard.querySelector(".edit-btn");

    editBtn.addEventListener("click", function () {

        companyInput.value = job.company;

        roleInput.value = job.role;

        dateInput.value = job.date || "";

        statusInput.value = job.status;


        editIndex = index;


        jobForm.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// Dashboard

function updateDashboard() {

    totalJobs.textContent = jobs.length;


    const applied = jobs.filter(function (job) {

        return job.status === "Applied";

    }).length;


    const interview = jobs.filter(function (job) {

        return job.status === "Interview";

    }).length;


    const selected = jobs.filter(function (job) {

        return job.status === "Selected";

    }).length;


    appliedJobs.textContent = applied;

    interviewJobs.textContent = interview;

    selectedJobs.textContent = selected;

}


// Clear form

function clearForm() {

    companyInput.value = "";

    roleInput.value = "";

    dateInput.value = "";

    statusInput.value = "Applied";

    jobForm.style.display = "none";

}


// Search and Filter

function filterJobs() {

    const searchText = searchInput.value.toLowerCase();

    const selectedStatus = filterStatus.value;


    const jobCards = document.querySelectorAll(".job-card");


    jobCards.forEach(function (card) {

        const company =
            card.querySelector("h3").textContent.toLowerCase();

        const role =
            card.querySelector("p").textContent.toLowerCase();


        const status =
            card.querySelector("span").textContent;


        const matchesSearch =
            company.includes(searchText) ||
            role.includes(searchText);


        const matchesStatus =
            selectedStatus === "All" ||
            status === selectedStatus;


        if (matchesSearch && matchesStatus) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


searchInput.addEventListener("input", filterJobs);

filterStatus.addEventListener("change", filterJobs);


// Load jobs when page opens

displayJobs();

updateDashboard();