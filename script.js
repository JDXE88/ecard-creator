function updatePreview() { const a = document.getElementById("addressInput").value, b = document.getElementById("addressPreview"); if ("" === a.trim()) b.innerHTML = "Address will appear here"; else { const c = a.split("\n").map(a => a.trim()).filter(a => "" !== a).map(a => `<p>${a}</p>`).join(""); b.innerHTML = c || "Address will appear here" } const d = document.getElementById("greetingMessage").value, e = document.getElementById("messagePreview"); "" === d.trim() ? e.innerHTML = "Your greeting message will appear here" : e.innerHTML = d.replace(/\n/g, "<br>"); const f = document.getElementById("fromMessage").value, g = document.getElementById("fromPreview"); "" === f.trim() ? g.innerHTML = "- From" : g.innerHTML = `- ${f}` } function previewStamp(a) { const b = document.getElementById("stampPreviewContainer"), c = a.target.files[0]; if (c) { const d = new FileReader; d.onload = function (a) { b.innerHTML = `<img src="${a.target.result}" alt="Stamp">` }, d.readAsDataURL(c) } else b.innerHTML = "<span>Stamp</span>" } function previewCardImage(a) { const b = document.getElementById("imagePreviewContainer"), c = a.target.files[0]; if (c) { const d = new FileReader; d.onload = function (a) { b.innerHTML = `<img src="${a.target.result}" alt="Card Image">` }, d.readAsDataURL(c) } else b.innerHTML = "<span>Your image will appear here</span>" } function generateDownloadableCard() {
    const a = document.getElementById("addressInput").value, b = document.getElementById("greetingMessage").value, c = document.getElementById("fromMessage").value; let d = "/stamp.png", e = ""; const f = document.querySelector("#stampPreviewContainer img"); f && (d = f.src); const g = document.querySelector("#imagePreviewContainer img"); if (!g) return void alert("Please upload a card image"); e = g.src; const h = a.split("\n").map(a => a.trim()).filter(a => "" !== a).map(a => `<p>${a}</p>`).join(""), i = b.replace(/\n/g, "<br>"), j = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flip & Open Envelope</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap">
    <style>
        body{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f4f4f4;margin:0;perspective:1000px}
        .container{position:relative;width:300px;height:200px;cursor:pointer}
        .flip-container{width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s ease-in-out}
        .flipped{transform:rotateY(180deg)}
        .envelope,.envelope-back{position:absolute;width:100%;height:100%;background:#f5e1b3;border-radius:5px;box-shadow:0 5px 15px rgba(0,0,0,.2);border:3px solid #e0c597;backface-visibility:hidden;display:flex;justify-content:center;align-items:center}
        .stamp{position:absolute;top:10px;right:10px;width:50px;height:auto;border:2px solid #c0a060;box-shadow:2px 2px 5px rgba(0,0,0,.3)}
        .address{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;font-family:'Special Elite',cursive;font-size:14px;color:#333;line-height:1.4}
        .address p{margin:2px 0}
        .envelope-back{transform:rotateY(180deg)}
        .flap{position:absolute;width:100%;height:100px;background:#e3c998;top:0;transform-origin:top;transition:transform 1s ease-in-out;clip-path:polygon(0 0,100% 0,50% 100%);border-bottom:3px solid #d1b48c}
        .ecard-container{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.5);opacity:0;transition:transform .8s ease-in-out,opacity .8s;z-index:10;max-width:100%;max-height:100%;cursor:pointer}
        .ecard-image{width:auto;height:auto;max-width:90vw;max-height:90vh;display:block}
        .greeting-container{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#fff;padding:30px;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.3);opacity:0;transition:opacity .5s ease-in-out;z-index:20;font-family:'Special Elite',cursive;text-align:center;display:flex;flex-direction:column;justify-content:center}
        .greeting-message{font-size:20px;margin-bottom:20px;line-height:1.5}
        .from-message{font-style:italic;text-align:right;margin-top:20px}
        .close-greeting{display:inline-block;padding:8px 16px;background-color:#e0c597;color:#333;border:none;border-radius:5px;cursor:pointer;font-family:'Special Elite',cursive;transition:background-color .3s;margin-top:20px}
        .close-greeting:hover{background-color:#d1b48c}
        .envelope-back.open .flap{transform:rotateX(180deg)}
        .envelope-back.open+.ecard-container{opacity:1;transform:translate(-50%,-50%) scale(1)}
        .show-greeting{opacity:1}
    </style>
</head>
<body>
    <div class="container" onclick="flipEnvelope()">
        <div class="flip-container">
            <div class="envelope">
                <img class="stamp" src="${d}" alt="Stamp">
                <div class="address">${h || "<p>Recipient</p>"}</div>
            </div>
            <div class="envelope-back" onclick="openEnvelope(event)">
                <div class="flap"></div>
            </div>
        </div>
    </div>
    <div class="ecard-container" onclick="showGreeting()">
        <img class="ecard-image" src="${e}" alt="E-Card" id="ecardImage">
    </div>
    <div class="greeting-container" id="greetingContainer">
        <div class="greeting-message">${i || "Happy Holidays!"}</div>
        ${c ? `<div class="from-message">- ${c}</div>` : ""}
        <button class="close-greeting" onclick="closeGreeting()">Close</button>
    </div>
    <script>
        let isFlipped=false;function flipEnvelope(){isFlipped||(document.querySelector('.flip-container').classList.add('flipped'),isFlipped=!0)}function openEnvelope(e){e.stopPropagation(),document.querySelector('.envelope-back').classList.add('open'),document.querySelector('.ecard-container').style.opacity="1",document.querySelector('.ecard-container').style.transform="translate(-50%, -50%) scale(1)"}function showGreeting(){const e=document.getElementById("ecardImage"),t=document.getElementById("greetingContainer");t.style.width=e.offsetWidth+"px",t.style.height=e.offsetHeight+"px",t.classList.add("show-greeting")}function closeGreeting(){window.location.reload()}
    </script>
</body>
</html>`; const k = document.createElement("a"); k.setAttribute("href", "data:text/html;charset=utf-8," + encodeURIComponent(j)), k.setAttribute("download", "ecard.html"), k.style.display = "none", document.body.appendChild(k), k.click(), document.body.removeChild(k)
}