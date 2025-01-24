export async function make(seed = null, number = 17) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const url = `${baseUrl}/api/puzzle/make${seed ? `?seed=${seed}` : ''}${seed ? "&" : "?"}number=${number}`;


    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        // console.log('Making request to: ', url);
        // console.log('Response: ', data);
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
}

export async function validate(squares, seed) {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/puzzle/validate`;
    // console.log('Validating request to: ', url);
    // console.log('Sending: ', squares);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ squares, seed }),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Response: ', data);

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}