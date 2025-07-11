const anomalyModel = require('../models/anomalyModel');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const data = await anomalyModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await anomalyModel.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Anomaly not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const newRecord = await anomalyModel.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await anomalyModel.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Anomaly not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await anomalyModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Anomaly not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
