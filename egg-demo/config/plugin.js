"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  mysql: {
    enable: true,
    package: "egg-mysql",
  },
  jwt: {
    enable: true,
    package: "egg-jwt",
  },
  cors: {
    enable: true,
    package: "egg-cors",
  },
  validate: {
    enable: true,
    package: "egg-validate",
  },
};
