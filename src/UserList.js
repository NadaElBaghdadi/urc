 export function fetchAllUsers(onResult, onError) {
    const currentUsername = sessionStorage.getItem('username'); // Récupérer le nom d'utilisateur connecté

    fetch("/api/users", {
        method: "GET",
        headers: {
            "Authentication": `Bearer ${sessionStorage.getItem('token')}`,
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const users = await response.json();

                const filteredUsers = users.filter(user => user.username !== currentUsername);

                onResult(filteredUsers); 
            } else {
                const error = await response.json();
                onError(error);
            }
        })
        .catch(onError);
}
 