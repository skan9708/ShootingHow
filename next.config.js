module.exports = {
    async rewrites() {
        if (process.env.NODE_ENV !== 'production') {
            return [
                {
                    destination: 'http://localhost:8000/api/:path*/',
                    source: '/api/:path*',
                },
            ];
        } else {
            return []
        }
    },
}