const router = require("express").Router();
const House = require("../models/House");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const Family = require("../models/Family");



router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const houses = await House.findAll({ include: "Families", where: { "isDeleted": false } });
        res.status(200).json(houses)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const house = await House.findOne({ include: "Families", where: { "id": req.params.id, "isDeleted": false } });
        res.status(200).json(house)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    data["added_by"] = req.user.id;
    data["isDeleted"] = false;
    try {
        const house = await House.create(data);
        res.status(201).json(house);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    const data = req.body;
    data["added_by"] = req.user.id;
    try {
        await House.update(data, { "where": { "id": req.params.id } });
        const house = await House.findOne({ "where": { "id": req.params.id } })
        res.status(201).json(house);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const count = await Family.count({
            where: { house_no: req.params.id,isDeleted : false }
        });
        if (count >= 1) {
            res.status(304).json("cannot delete house which consists of active families");
        } else {
            var todayDate = new Date().toISOString().slice(0, 10);
            const data = {
                isDeleted: true,
                deletedBy: req.user.id,
                deletedOn: todayDate
            };
            const house = await House.update(data, { "where": { "id": req.params.id } });
            res.status(201).json(true);
        }
    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router;