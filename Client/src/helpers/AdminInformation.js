const Data = localStorage.getItem('Admin Credentials')
const existanceOfData = Data !== null

if (existanceOfData) {
    if (Data && Data !== "undefined") {
        const adminAuth = JSON.parse(localStorage.getItem("Admin Credentials"));
        module.exports = { adminAuth }
    } else {
        const adminAuth = [];
        module.exports = { adminAuth }
    }
} else {
    const adminAuth = []
    module.exports = { adminAuth }
}
