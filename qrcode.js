
const streams = ["111", "222", "333", "444"];
const clases = ["1", "2", "3", "4"];

function convertStream(rawStream) {
  switch (rawStream) {
    case "111": return "Green";
    case "222": return "Blue";
    case "333": return "Red";
    case "444": return "Purple";
    default: return "Unknown";
  }
}

function getColorByStream(streamCode) {
  switch (streamCode) {
    case "111": return "#008000"; // Green
    case "222": return "#0000ff"; // Blue
    case "333": return "#cc0000"; // Red
    case "444": return "#800080"; // Purple
    default: return "#000000";
  }
}

function generateStyledQRs() {
  const container = document.querySelector(".qr-container");
  container.innerHTML = "";

  for (let c = 0; c < clases.length; c++) {
    for (let s = 0; s < streams.length; s++) {
      const color = getColorByStream(streams[s]);
      const label = `Form ${clases[c]} ${convertStream(streams[s])}`;
      const value = `${clases[c]}-${streams[s]}`;

      const qrDiv = document.createElement("div");
      qrDiv.className = "box";

      const title = document.createElement("h3");
      title.textContent = label;

      const qrCode = new QRCodeStyling({
        width: 160,
        height: 160,
        data: value,
        dotsOptions: {
          color: color,
          type: "classy",
        },
        backgroundOptions: {
          color: "#ffffff",
        }
      });

      const qrCanvas = document.createElement("div");
      qrCode.append(qrCanvas);

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download";
      downloadBtn.onclick = () => {
        qrCode.download({
          name: value,
          extension: "png",
        });
      };

      qrDiv.appendChild(title);
      qrDiv.appendChild(qrCanvas);
      qrDiv.appendChild(downloadBtn);
      container.appendChild(qrDiv);
    }
  }
}

generateStyledQRs();

