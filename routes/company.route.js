const express = require("express");
const { company: companyRoute } = require("../constants/constant.route");
const CompanyController = require("../controllers/company.controller");
const CommonServies  = require("../services/common.service");
const router = express.Router();

router.route(companyRoute.addCompany).post(CompanyController.addCompany);
router.route(companyRoute.updateCompany).post(CompanyController.updateCompany);
router.route(companyRoute.getCompanies).post(CompanyController.getCompanies);

module.exports = router;
