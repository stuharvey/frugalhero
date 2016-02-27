var TempControl = module.exports = {};

TempControl.test = function() {
  console.log('hey its me ur temperature controller');
  this.nestToken = process.env.NEST_TOKEN;
  console.log('houston we have nestoken' + this.nestToken);
}
