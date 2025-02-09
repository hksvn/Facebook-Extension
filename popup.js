function updateCookies() {
  chrome.cookies.getAll({ domain: "facebook.com" }, (cookies) => {
    let cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");
    const includeUA = document.getElementById("usx").checked;
    if (includeUA) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => navigator.userAgent
          }, (results) => {
            if (results && results[0] && results[0].result) {
              cookieString += `; user_agent=${results[0].result}`;
            }
            document.getElementById("cookies").value = cookieString || "Không có cookie nào!";
          });
        } else {
          document.getElementById("cookies").value = cookieString || "Không có cookie nào!";
        }
      });
    } else {
      document.getElementById("cookies").value = cookieString || "Không có cookie nào!";
    }
  });
}

document.getElementById("refresh-button").addEventListener("click", () => {
  document.getElementById("cookies").value = "Đang tải cookie, vui lòng chờ...";
  updateCookies();
});

document.getElementById("copy-cookies-button").addEventListener("click", () => {
  const cookiesElem = document.getElementById("cookies");
  cookiesElem.select();
  document.execCommand("copy");
  alert("Cookies đã được copy vào clipboard!");
});

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  updateCookies();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateCookies();
  }
});
