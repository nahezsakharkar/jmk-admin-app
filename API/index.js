const config = require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { Logger } = require('./middlewares/logger');

const sequalize = require("./config/database");

const Admin = require("./models/Admin");
const House = require("./models/House");
const Family = require("./models/Family");
const Member = require("./models/Member");
const JmkYear = require("./models/JmkYear");
const JmkPaymentHistory = require("./models/JmkPaymentHistory");

Admin.hasMany(House, {
    foreignKey: 'added_by'
});
House.belongsTo(Admin, {
    foreignKey: 'added_by'
});
House.hasMany(Family, {
    foreignKey: 'house_no'
});
Family.belongsTo(Admin, {
    foreignKey: 'added_by'
})
Family.hasMany(Member, {
    foreignKey: "family_id"
});
JmkYear.belongsTo(Admin, {
    foreignKey: "added_by"
});
JmkYear.hasMany(JmkPaymentHistory)
Member.hasMany(JmkPaymentHistory, {
    foreignKey: "member_id"
});
Member.belongsTo(Admin, {
    foreignKey: "added_by"
});
JmkPaymentHistory.belongsTo(JmkYear, {
    foreignKey: "year"
});
JmkPaymentHistory.belongsTo(Admin, {
    foreignKey: "added_by"
});

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const houseRoutes = require("./routes/house");
const familyRoutes = require("./routes/family");
const memberRoutes = require("./routes/member");
const JmkYearRoutes = require("./routes/jmkYear");
const JmkPayHistoryRoutes = require("./routes/jmkPaymentHistory");
const dashboardRoutes = require("./routes/dashboard");
const MobileRoutes = require("./routes/mobile");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Logger)

//To Serve React Build
app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });
// app.get('/Dashboard', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });




//API ENDPOINTS
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/house', houseRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/jmkYear', JmkYearRoutes);
app.use('/api/jmkPayments', JmkPayHistoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mobile',MobileRoutes);

app.get('*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


sequalize.sync()
    .then((result) => {
        app.listen(config.PORT, () => {
            console.log(`Server Listening To Port : ${config.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err);
    });

