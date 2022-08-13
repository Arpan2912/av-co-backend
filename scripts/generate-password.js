require("dotenv").config();
const CommonService = require("../services/common.service");

const genearePassword = async (password) => {
  const encPassword = await CommonService.generateSha512Hash(password);
  console.log("password", encPassword)
}

genearePassword("123");