export function fetchRooms(onResult, onError) {
    fetch("/api/rooms", {  
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,  
            "Content-Type": "application/json",
        },
    })
    .then(async (response) => {
        if (response.ok) {
            const rooms = await response.json();
            onResult(rooms);  
        } else {
            const error = await response.json();
            onError(error);  
        }
    })
    .catch(onError);  
}

