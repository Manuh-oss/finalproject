async function getUser() {
  try {
    const response = await fetch("saved_user.php", {
      method: "GET",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("login error", error);
  }
}

async function getSetup() {
  try {
    const user = await getUser();
    const response = await fetch("getsetup.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("setup error", error);
  }
}

function showInitialLoader() {
  const loader = document.createElement("div");
  loader.className = "loading-page";

  const schoolDiv = document.createElement("div");
  schoolDiv.className = "school";

  const img = document.createElement("img");
  
  const h3 = document.createElement("h3");
  h3.innerHTML = "Preparing your learning environment… <i class='fa-solid fa-wave-square'></i>";

  schoolDiv.appendChild(img);
  schoolDiv.appendChild(h3);
  loader.appendChild(schoolDiv);

  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(loader);

    requestAnimationFrame(() => {
      loader.style.opacity = "1";
      loader.style.transform = "scale(1)";
    });
  });

  const hideLoader = () => {
    loader.style.opacity = "0";
    loader.style.transform = "scale(0.5)";
    setTimeout(() => loader.remove(), 400);
  };
  return hideLoader;
}

const hideLoaderCallback = showInitialLoader();
