'use client';

export default function Test(){
    
    const handleOnClick = async () => {
        try {
            console.log("clicked")
            const response = await fetch('api/db/add_city_district?city=台北市&district=中正區');

            if (response.ok) {
                // Handle success
                console.log('City district created successfully');
            } else {
                // Handle error
                console.error('Failed to create city district');
            }
        } catch (error) {
            // Handle network error
            console.error('Network error:', error);
        }
    }

    return (
        <div>
            <button onClick={handleOnClick}>Test</button>
        </div>
    )
}