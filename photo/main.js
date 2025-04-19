var sendButton = document.getElementById("sendButton")
var filesLabel = document.getElementById("filesLabel")
var filesInput = document.getElementById("filesInput")
var signatureInput = document.getElementById("signatureInput")

var imagesSelected = false
var signatureSelected = false
var sendingInProgress = false

updateSendLabel()

function updateSendLabel() {
    var isEnabled = imagesSelected && signatureSelected && !sendingInProgress
    var wasEnabled = !sendButton.hasAttribute("disabled")

    if (wasEnabled != isEnabled) {
        if (wasEnabled) {
            sendButton.setAttribute("disabled", "")
        } else {
            sendButton.removeAttribute("disabled")
        }
    }

    if (!signatureSelected) {
        sendButton.innerHTML = "Nie wybrano podpisu"
    } else if (!imagesSelected) {
        sendButton.innerHTML = "Nie wybrano zdjęć"
    } else if (sendingInProgress) {
        // wait
    } else {
        sendButton.innerHTML = "Wyślij"
    }
}

function getFileString(count) {
    if (count == 1) return "plik"
    if ((count % 100) >= 12 && (count % 100) <= 14) return "plików"
    if ((count % 10) >= 2 && (count % 10) <= 4) return "pliki"
    return "plików"
}

async function sendFiles(files) {
    var count = files.length
    var index = 0
    sendingInProgress = true
    while (index < count) {
        sendButton.innerHTML = "Wysyłanie " + (index + 1) + "/" + count

        var data = new FormData()
        data.append('image', files[index])
        data.append('type', "image")
        data.append('title', signatureInput.value)
        data.append('description', "Image " + (index + 1) + "/" + count)

        try {
            var response = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    Authorization: "Bearer 3b743ff1618e6be538b4bf2636af0f56ccde7b83",
                },
                body: data
            });
            console.log(response)
        } catch (error) {
            console.error(error)
        }

        index += 1;
    }
    sendButton.innerHTML = "Wysłano!";
    sendingInProgress = false
}

sendButton.addEventListener("pointerdown", function (e) {
    if (sendButton.hasAttribute("disabled")) {
        return
    }

    sendButton.setAttribute("disabled", "")
    sendFiles(filesInput.files)
})

filesInput.addEventListener("change", function (e) {
    var count = e.target.files.length
    filesLabel.innerHTML = "Wybrano " + count + " " + getFileString(count)
    imagesSelected = count > 0
    updateSendLabel()
})

signatureInput.addEventListener("change", function (e) {
    if (e.target.value) {
        signatureSelected = true
    } else {
        signatureSelected = false
    }
    updateSendLabel()
})
