module.exports = {
    async rewrites() {
        if (process.env.NODE_ENV !== 'production') {
            return [
                {
                    destination: 'http://chlee.cf:8000/api/:path*/',
                    // destination: 'https://www.t-sports.kr/api/:path*/',
                    // destination: 'http://chlee.ddns.net:8000/api/:path*/',
                    source: '/api/:path*',
                },
            ];
        } else {
            return []
        }
    },
}