const Joi = require('joi');

const anomalySchemaUpdate = Joi.object({
  action_required: Joi.string().max(255).required(), // TODO: better to use enum from rlated DB table
  suspected_reason: Joi.string().max(255).required(), // TODO: better to use enum from rlated DB table
  comments: Joi.string().max(255).required(),
});

module.exports = anomalySchemaUpdate;
