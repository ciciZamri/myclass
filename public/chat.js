firebase.initializeApp({
    apiKey: "AIzaSyDV53HYfVfUA9aoy7X7-IbFrlEVXCsGtrs",
    authDomain: "sandbox-99.firebaseapp.com",
    projectId: "sandbox-99",
});

function send() {
    let message = document.getElementById("message").value;
    console.log(message);
    if (message.length > 0) {
        fetch(`${window.location.origin}/chat/create/${window.location.pathname.split('/').at(-1)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("message").value = "";
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

function get() {
    const courseId = window.location.pathname.split('/').at(-1);
    const db = firebase.firestore();
    db.collection("chats").doc(courseId)
        .onSnapshot((doc) => {
            fetch(`${window.location.origin}/chat/read/${courseId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    let content = "";
                    for (let i = 0; i < data.length; i++) {
                        content += `
                    <div>
                    <div class="rounded bg-gray-300 my-2 p-2 inline-block" >
                        <p class="text-sm" >${data[i].author}</p>
                        <p>${data[i].message}</p>
                        <p class="text-xs">${formatTime(data[i].createdAt)}</p>
                    </div>
                    </div>
                `;
                    }
                    document.getElementById("chat").innerHTML = content;
                    window.scrollBy(0, document.body.scrollHeight);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
}

function formatTime(time) {
    // TODO: FORMAT TIME
    return time;
}

document.getElementById("send-btn").addEventListener('click', send);
get();