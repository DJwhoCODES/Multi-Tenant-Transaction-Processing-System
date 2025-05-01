const { getUserDbConnection } = require('../utils/dbHelper');
const { parseSlabs } = require('../utils/slabParser');
const ServiceChargeSchema = require('../models/serviceCharge');

// Utility to get the ServiceCharge model for a user
const getServiceChargeModel = async (userId) => {
    try {
        const conn = await getUserDbConnection(userId);
        return conn.models.ServiceCharge || conn.model('ServiceCharge', ServiceChargeSchema);
    } catch (error) {
        console.log(error.message);
    }
};

exports.assignService = async (req, res) => {
    try {
        const { userId, serviceId, slabs } = req.body;
        const ServiceChargeModel = await getServiceChargeModel(userId);
        console.log(ServiceChargeModel);
        const entry = new ServiceChargeModel({ userId, serviceId, slabs });
        await entry.save();

        res.json({ message: 'Service assigned successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Service assignment failed', error: err.message });
    }
};

exports.calculateCharge = async (req, res) => {
    try {
        const { userId, serviceId, amount } = req.body;
        const ServiceCharge = await getServiceChargeModel(userId);

        const record = await ServiceCharge.findOne({ userId, serviceId });
        if (!record) return res.status(404).json({ message: 'Service not found' });

        const slab = parseSlabs(record.slabs, amount);
        if (!slab) return res.status(400).json({ message: 'No applicable slab found' });

        const gst = (slab.rate * 0.18).toFixed(2); // 18% GST
        res.json({ serviceCharge: slab.rate, gst });
    } catch (err) {
        res.status(500).json({ message: 'Charge calculation failed', error: err.message });
    }
};
