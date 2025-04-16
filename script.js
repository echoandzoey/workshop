document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const introPage = document.getElementById("intro-page");
  const profilePage = document.getElementById("profile-page");
  const reflectionPage = document.getElementById("reflection-page");
  const outcomePage = document.getElementById("outcome-page");
  const finalPage = document.getElementById("final-page");
  const overviewPage = document.getElementById("overview-page");

  const introContent = document.getElementById("intro-content");
  const profileContent = document.getElementById("profile-content");
  const outcomeContent = document.getElementById("outcome-content");
  const overviewContent = document.getElementById("overview-content");
  const reflectionInput = document.getElementById("reflection-input");

  const startBtn = document.getElementById("start-btn");
  const decisionBtns = document.querySelectorAll(".decision-btn");
  const submitReflectionBtn = document.getElementById("submit-reflection-btn");
  const nextProfileBtn = document.getElementById("next-profile-btn");
  const showOverviewBtn = document.getElementById("show-overview-btn");
  const restartBtn = document.getElementById("restart-btn");

  // Workshop state
  let participants = [];
  let currentParticipantIndex = 0;
  let userReflections = [];
  let userDecisions = [];

  // Load intro content
  fetch("intro.json")
    .then((response) => response.json())
    .then((data) => {
      introContent.innerHTML = `
                <p>${data.introduction}</p>
                <p>${data.description}</p>
            `;
    })
    .catch((error) => {
      console.error("Error loading intro content:", error);
      introContent.innerHTML = "<p>Error loading introduction content.</p>";
    });

  // Load profiles
  fetch("profiles.json")
    .then((response) => response.json())
    .then((data) => {
      participants = data.participants;
    })
    .catch((error) => {
      console.error("Error loading profiles:", error);
    });

  // Event listeners
  startBtn.addEventListener("click", () => {
    showPage(profilePage);
    loadCurrentProfile();
  });

  decisionBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const decision = e.target.dataset.decision;
      userDecisions[currentParticipantIndex] = decision;
      showPage(reflectionPage);
    });
  });

  submitReflectionBtn.addEventListener("click", () => {
    const reflection = reflectionInput.value.trim();
    if (reflection) {
      userReflections[currentParticipantIndex] = reflection;
      reflectionInput.value = "";
      showPage(outcomePage);
      loadOutcome();

      // Save reflection
      saveReflection(currentParticipantIndex, reflection);
    } else {
      alert("Please enter your reflection before continuing.");
    }
  });

  nextProfileBtn.addEventListener("click", () => {
    currentParticipantIndex++;
    if (currentParticipantIndex < participants.length) {
      loadCurrentProfile();
      showPage(profilePage);
    } else {
      showPage(finalPage);
    }
  });

  showOverviewBtn.addEventListener("click", () => {
    loadOverview();
    showPage(overviewPage);
  });

  restartBtn.addEventListener("click", () => {
    currentParticipantIndex = 0;
    userReflections = [];
    userDecisions = [];
    showPage(introPage);
  });

  // Helper functions
  function showPage(pageToShow) {
    // Hide all pages
    introPage.classList.add("hidden");
    profilePage.classList.add("hidden");
    reflectionPage.classList.add("hidden");
    outcomePage.classList.add("hidden");
    finalPage.classList.add("hidden");
    overviewPage.classList.add("hidden");

    // Show requested page
    pageToShow.classList.remove("hidden");
  }

  function loadCurrentProfile() {
    const participant = participants[currentParticipantIndex];
    const avatarPath = `images/${participant.name}.jpg`;

    profileContent.innerHTML = `
            <div class="avatar-container">
                <img src="${avatarPath}" alt="${participant.name}" class="avatar">
            </div>
            <div class="profile-header">
                <div class="profile-name">${participant.name}</div>
                <div class="profile-age">${participant.age} years old</div>
            </div>
            <div class="profile-details">
                <div class="profile-item"><strong>Living Situation:</strong> ${participant["living situation"]}</div>
                <div class="profile-item"><strong>Free Time and Interests:</strong> ${participant["Free time and interests"]}</div>
                <div class="profile-item"><strong>Current Situation:</strong> ${participant["Current situation"]}</div>
            </div>
        `;
  }

  function loadOutcome() {
    const participant = participants[currentParticipantIndex];
    const avatarPath = `images/${participant.name}.jpg`;

    outcomeContent.innerHTML = `
            <div class="avatar-container">
                <img src="${avatarPath}" alt="${
      participant.name
    }" class="avatar">
            </div>
            <div class="profile-header">
                <div class="profile-name">${participant.name}</div>
                <div class="profile-age">${participant.age} years old</div>
            </div>
            <div class="profile-item"><strong>What ${
              participant.name
            } chose:</strong> ${
      participant["What " + participant.name + " chose"]
    }</div>
            <div class="profile-item"><strong>A couple of years later:</strong> ${
              participant["A couple of years later"]
            }</div>
        `;
  }

  function loadOverview() {
    let overviewHTML = "";

    participants.forEach((participant, index) => {
      const avatarPath = `images/${participant.name}.jpg`;

      overviewHTML += `
        <div class="overview-card">
          <div class="avatar-container">
            <img src="${avatarPath}" alt="${participant.name}" class="avatar">
          </div>
          <div class="profile-header">
            <div class="profile-name">${participant.name}</div>
            <div class="profile-age">${participant.age} years old</div>
          </div>
          <div class="overview-outcome">
            <div class="profile-item"><strong>What ${
              participant.name
            } chose:</strong> ${
        participant["What " + participant.name + " chose"]
      }</div>
            <div class="profile-item"><strong>A couple of years later:</strong> ${
              participant["A couple of years later"]
            }</div>
          </div>
        </div>
      `;
    });

    overviewContent.innerHTML = overviewHTML;
  }

  function formatDecision(decision) {
    switch (decision) {
      case "no-aid":
        return "No financial aid needed";
      case "loan":
        return "Long-term loan plan";
      case "personal-aid":
        return "Personalized financial aid";
      default:
        return "Unknown decision";
    }
  }

  function saveReflection(index, reflection) {
    // Create an identifier for the reflection
    const participantName = participants[index].name;
    const key = `reflection_${participantName}`;

    // Save to localStorage as fallback
    localStorage.setItem(key, reflection);

    // Try to save to server if it's available
    try {
      fetch("/save-reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantName,
          reflection,
          decision: userDecisions[index],
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Reflection saved to server successfully");
          } else {
            console.log("Saving to server failed, but saved to localStorage");
          }
        })
        .catch((error) => {
          console.error("Error saving to server:", error);
          console.log("Saving to localStorage as fallback");
        });
    } catch (error) {
      console.log("Server unavailable, saved to localStorage only");
    }
  }
});
