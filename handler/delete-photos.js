exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const { pk, sk } = JSON.parse(event.body);

        if (!pk || !sk) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://16november2024.com',
                },
                body: JSON.stringify({ message: 'Missing required parameters pk or sk' })
            };
        }

        // Your existing delete logic here
        // ...

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://16november2024.com',
            },
            body: JSON.stringify({ message: 'Photo deleted successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://16november2024.com',
            },
            body: JSON.stringify({
                message: 'Failed to delete photo',
                error: error.message
            })
        };
    }
}; 
