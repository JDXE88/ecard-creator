function updatePreview() {
    const addressInput = document.getElementById('addressInput').value;
    const addressPreview = document.getElementById('addressPreview');
    if (addressInput.trim() === '') {
        addressPreview.innerHTML = 'Address will appear here';
    } else {
        const addressLines = addressInput.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '')
            .map(line => `<p>${line}</p>`)
            .join('');
        addressPreview.innerHTML = addressLines || 'Address will appear here';
    }

    const messageInput = document.getElementById('greetingMessage').value;
    const messagePreview = document.getElementById('messagePreview');
    if (messageInput.trim() === '') {
        messagePreview.innerHTML = 'Your greeting message will appear here';
    } else {
        messagePreview.innerHTML = messageInput.replace(/\n/g, '<br>');
    }

    const fromInput = document.getElementById('fromMessage').value;
    const fromPreview = document.getElementById('fromPreview');
    if (fromInput.trim() === '') {
        fromPreview.innerHTML = '- From';
    } else {
        fromPreview.innerHTML = `- ${fromInput}`;
    }
}

function previewStamp(event) {
    const stampPreview = document.getElementById('stampPreviewContainer');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            stampPreview.innerHTML = `<img src="${e.target.result}" alt="Stamp">`;
        }
        reader.readAsDataURL(file);
    } else {
        stampPreview.innerHTML = '<span>Stamp</span>';
    }
}

function previewCardImage(event) {
    const imagePreview = document.getElementById('imagePreviewContainer');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Card Image">`;
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '<span>Your image will appear here</span>';
    }
}

function generateCode() {
    const addressInput = document.getElementById('addressInput').value;
    const greetingMessage = document.getElementById('greetingMessage').value;
    const fromMessage = document.getElementById('fromMessage').value;

    let stampSrc = '';
    let cardSrc = '';

    const stampImg = document.querySelector('#stampPreviewContainer img');
    if (stampImg) {
        stampSrc = stampImg.src;
    }

    const cardImg = document.querySelector('#imagePreviewContainer img');
    if (cardImg) {
        cardSrc = cardImg.src;
    } else {
        alert('Please upload a card image');
        return;
    }

    const formattedAddress = addressInput.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => `<p>${line}</p>`)
        .join('');

    const formattedGreeting = greetingMessage.replace(/\n/g, '<br>');

    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flip & Open Envelope</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap">
    <style>
        body {display:flex; justify-content:center; align-items:center; height:100vh; background-color:#f4f4f4; margin:0; perspective:1000px;}
        .container {position:relative; width:300px; height:200px; cursor:pointer;}
        .flip-container {width:100%; height:100%; transform-style:preserve-3d; transition:transform 1s ease-in-out;}
        .flipped {transform:rotateY(180deg);}
        .envelope, .envelope-back {position:absolute; width:100%; height:100%; background:#f5e1b3; border-radius:5px; box-shadow:0 5px 15px rgba(0,0,0,0.2); border:3px solid #e0c597; backface-visibility:hidden; display:flex; justify-content:center; align-items:center;}
        .envelope {display:flex; justify-content:center; align-items:center;}
        .stamp {position:absolute; top:10px; right:10px; width:50px; height:auto; border:2px solid #c0a060; box-shadow:2px 2px 5px rgba(0,0,0,0.3);}
        .address {position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); text-align:center; font-family:'Special Elite',cursive; font-size:14px; color:#333; line-height:1.4;}
        .address p {margin:2px 0;}
        .envelope-back {transform:rotateY(180deg);}
        .flap {position:absolute; width:100%; height:100px; background:#e3c998; top:0; transform-origin:top; transition:transform 1s ease-in-out; clip-path:polygon(0 0, 100% 0, 50% 100%); border-bottom:3px solid #d1b48c;}
        .ecard-container {position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) scale(0.5); opacity:0; transition:transform 0.8s ease-in-out, opacity 0.8s; z-index:10; max-width:100%; max-height:100%; cursor:pointer;}
        .ecard-image {width:auto; height:auto; max-width:90vw; max-height:90vh; display:block;}
        .greeting-container {position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#fff; padding:30px; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.3); opacity:0; transition:opacity 0.5s ease-in-out; z-index:20; font-family:'Special Elite',cursive; text-align:center; display:flex; flex-direction:column; justify-content:center;}
        .greeting-message {font-size:20px; margin-bottom:20px; line-height:1.5;}
        .from-message {font-style:italic; text-align:right; margin-top:20px;}
        .close-greeting {display:inline-block; padding:8px 16px; background-color:#e0c597; color:#333; border:none; border-radius:5px; cursor:pointer; font-family:'Special Elite',cursive; transition:background-color 0.3s; margin-top:20px;}
        .close-greeting:hover {background-color:#d1b48c;}
        .envelope-back.open .flap {transform:rotateX(180deg);}
        .envelope-back.open + .ecard-container {opacity:1; transform:translate(-50%,-50%) scale(1);}
        .show-greeting {opacity:1;}
    </style>
</head>
<body>
    <div class="container" onclick="flipEnvelope()">
        <div class="flip-container">
            <div class="envelope">
                ${stampSrc ? `<img class="stamp" src="${stampSrc}" alt="Stamp">` : ''}
                <div class="address">
                    ${formattedAddress || '<p>Recipient</p>'}
                </div>
            </div>
            <div class="envelope-back" onclick="openEnvelope(event)">
                <div class="flap"></div>
            </div>
        </div>
    </div>

    <div class="ecard-container" onclick="showGreeting()">
        <img class="ecard-image" src="${cardSrc}" alt="E-Card" id="ecardImage">
    </div>

    <div class="greeting-container" id="greetingContainer">
        <div class="greeting-message">
            ${formattedGreeting || 'Happy Holidays!'}
        </div>
        ${fromMessage ? `<div class="from-message">- ${fromMessage}</div>` : ''}
        <button class="close-greeting" onclick="closeGreeting()">Close</button>
    </div>

    <script>
        let isFlipped = false;
        function flipEnvelope() {
            if (!isFlipped) {
                document.querySelector('.flip-container').classList.add('flipped');
                isFlipped = true;
            }
        }
        function openEnvelope(event) {
            event.stopPropagation();
            document.querySelector('.envelope-back').classList.add('open');
            document.querySelector('.ecard-container').style.opacity = "1";
            document.querySelector('.ecard-container').style.transform = "translate(-50%,-50%) scale(1)";
        }
        function showGreeting() {
            const ecardImage = document.getElementById('ecardImage');
            const greetingContainer = document.getElementById('greetingContainer');
            greetingContainer.style.width = ecardImage.offsetWidth + 'px';
            greetingContainer.style.height = ecardImage.offsetHeight + 'px';
            greetingContainer.classList.add('show-greeting');
        }
        function closeGreeting() {
            window.location.reload();
        }
    </script>
</body>
</html>`;

    document.getElementById('codeOutput').textContent = htmlCode;
    document.getElementById('finalOutput').style.display = 'block';
    document.getElementById('finalOutput').scrollIntoView({ behavior: 'smooth' });
}

function copyCode() {
    const codeText = document.getElementById('codeOutput').textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        alert('Code copied to clipboard');
    }, () => {
        alert('Failed to copy code');
    });
}