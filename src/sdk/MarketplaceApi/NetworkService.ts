class NetworkService {
    static async fetchData(url:string, options:any) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
}

export default NetworkService;
