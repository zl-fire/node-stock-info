const ExcelMod = require("zl-excel")
let { info } = require("./data/info.json")

async function createTable() {
    // 表格数据信息
    const excelInfo = [
        {
            sheetName: 'stockTable', // 第一个sheet的名字
            columns: [
                {
                    "header": "JBZL_SECUCODE",
                    "key": "JBZL_SECUCODE",
                    "width": 10
                },
                {
                    "header": "JBZL_SECURITY_CODE",
                    "key": "JBZL_SECURITY_CODE",
                    "width": 10
                },
                {
                    "header": "JBZL_SECURITY_NAME_ABBR",
                    "key": "JBZL_SECURITY_NAME_ABBR",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_CODE",
                    "key": "JBZL_ORG_CODE",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_NAME",
                    "key": "JBZL_ORG_NAME",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_NAME_EN",
                    "key": "JBZL_ORG_NAME_EN",
                    "width": 10
                },
                {
                    "header": "JBZL_FORMERNAME",
                    "key": "JBZL_FORMERNAME",
                    "width": 10
                },
                {
                    "header": "JBZL_STR_CODEA",
                    "key": "JBZL_STR_CODEA",
                    "width": 10
                },
                {
                    "header": "JBZL_STR_NAMEA",
                    "key": "JBZL_STR_NAMEA",
                    "width": 10
                },
                {
                    "header": "JBZL_STR_CODEB",
                    "key": "JBZL_STR_CODEB",
                    "width": 10
                },
                {
                    "header": "JBZL_STR_NAMEB",
                    "key": "JBZL_STR_NAMEB",
                    "width": 10
                },
                {
                    "header": "JBZL_STR_CODEH",
                    "key": "JBZL_STR_CODEH",
                    "width": 10
                },
                {
                    "header": "JBZL_STR_NAMEH",
                    "key": "JBZL_STR_NAMEH",
                    "width": 10
                },
                {
                    "header": "JBZL_SECURITY_TYPE",
                    "key": "JBZL_SECURITY_TYPE",
                    "width": 10
                },
                {
                    "header": "JBZL_EM2016",
                    "key": "JBZL_EM2016",
                    "width": 10
                },
                {
                    "header": "JBZL_TRADE_MARKET",
                    "key": "JBZL_TRADE_MARKET",
                    "width": 10
                },
                {
                    "header": "JBZL_INDUSTRYCSRC1",
                    "key": "JBZL_INDUSTRYCSRC1",
                    "width": 10
                },
                {
                    "header": "JBZL_PRESIDENT",
                    "key": "JBZL_PRESIDENT",
                    "width": 10
                },
                {
                    "header": "JBZL_LEGAL_PERSON",
                    "key": "JBZL_LEGAL_PERSON",
                    "width": 10
                },
                {
                    "header": "JBZL_SECRETARY",
                    "key": "JBZL_SECRETARY",
                    "width": 10
                },
                {
                    "header": "JBZL_CHAIRMAN",
                    "key": "JBZL_CHAIRMAN",
                    "width": 10
                },
                {
                    "header": "JBZL_SECPRESENT",
                    "key": "JBZL_SECPRESENT",
                    "width": 10
                },
                {
                    "header": "JBZL_INDEDIRECTORS",
                    "key": "JBZL_INDEDIRECTORS",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_TEL",
                    "key": "JBZL_ORG_TEL",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_EMAIL",
                    "key": "JBZL_ORG_EMAIL",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_FAX",
                    "key": "JBZL_ORG_FAX",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_WEB",
                    "key": "JBZL_ORG_WEB",
                    "width": 10
                },
                {
                    "header": "JBZL_ADDRESS",
                    "key": "JBZL_ADDRESS",
                    "width": 10
                },
                {
                    "header": "JBZL_REG_ADDRESS",
                    "key": "JBZL_REG_ADDRESS",
                    "width": 10
                },
                {
                    "header": "JBZL_PROVINCE",
                    "key": "JBZL_PROVINCE",
                    "width": 10
                },
                {
                    "header": "JBZL_ADDRESS_POSTCODE",
                    "key": "JBZL_ADDRESS_POSTCODE",
                    "width": 10
                },
                {
                    "header": "JBZL_REG_CAPITAL",
                    "key": "JBZL_REG_CAPITAL",
                    "width": 10
                },
                {
                    "header": "JBZL_REG_NUM",
                    "key": "JBZL_REG_NUM",
                    "width": 10
                },
                {
                    "header": "JBZL_EMP_NUM",
                    "key": "JBZL_EMP_NUM",
                    "width": 10
                },
                {
                    "header": "JBZL_TATOLNUMBER",
                    "key": "JBZL_TATOLNUMBER",
                    "width": 10
                },
                {
                    "header": "JBZL_LAW_FIRM",
                    "key": "JBZL_LAW_FIRM",
                    "width": 10
                },
                {
                    "header": "JBZL_ACCOUNTFIRM_NAME",
                    "key": "JBZL_ACCOUNTFIRM_NAME",
                    "width": 10
                },
                {
                    "header": "JBZL_ORG_PROFILE",
                    "key": "JBZL_ORG_PROFILE",
                    "width": 10
                },
                {
                    "header": "JBZL_BUSINESS_SCOPE",
                    "key": "JBZL_BUSINESS_SCOPE",
                    "width": 10
                },
                {
                    "header": "JBZL_EXPAND_NAME_ABBR",
                    "key": "JBZL_EXPAND_NAME_ABBR",
                    "width": 10
                },
                {
                    "header": "FXXG_SECUCODE",
                    "key": "FXXG_SECUCODE",
                    "width": 10
                },
                {
                    "header": "FXXG_SECURITY_CODE",
                    "key": "FXXG_SECURITY_CODE",
                    "width": 10
                },
                {
                    "header": "FXXG_FOUND_DATE",
                    "key": "FXXG_FOUND_DATE",
                    "width": 10
                },
                {
                    "header": "FXXG_LISTING_DATE",
                    "key": "FXXG_LISTING_DATE",
                    "width": 10
                },
                {
                    "header": "FXXG_AFTER_ISSUE_PE",
                    "key": "FXXG_AFTER_ISSUE_PE",
                    "width": 10
                },
                {
                    "header": "FXXG_ONLINE_ISSUE_DATE",
                    "key": "FXXG_ONLINE_ISSUE_DATE",
                    "width": 10
                },
                {
                    "header": "FXXG_ISSUE_WAY",
                    "key": "FXXG_ISSUE_WAY",
                    "width": 10
                },
                {
                    "header": "FXXG_PAR_VALUE",
                    "key": "FXXG_PAR_VALUE",
                    "width": 10
                },
                {
                    "header": "FXXG_TOTAL_ISSUE_NUM",
                    "key": "FXXG_TOTAL_ISSUE_NUM",
                    "width": 10
                },
                {
                    "header": "FXXG_ISSUE_PRICE",
                    "key": "FXXG_ISSUE_PRICE",
                    "width": 10
                },
                {
                    "header": "FXXG_DEC_SUMISSUEFEE",
                    "key": "FXXG_DEC_SUMISSUEFEE",
                    "width": 10
                },
                {
                    "header": "FXXG_TOTAL_FUNDS",
                    "key": "FXXG_TOTAL_FUNDS",
                    "width": 10
                },
                {
                    "header": "FXXG_NET_RAISE_FUNDS",
                    "key": "FXXG_NET_RAISE_FUNDS",
                    "width": 10
                },
                {
                    "header": "FXXG_OPEN_PRICE",
                    "key": "FXXG_OPEN_PRICE",
                    "width": 10
                },
                {
                    "header": "FXXG_CLOSE_PRICE",
                    "key": "FXXG_CLOSE_PRICE",
                    "width": 10
                },
                {
                    "header": "FXXG_TURNOVERRATE",
                    "key": "FXXG_TURNOVERRATE",
                    "width": 10
                },
                {
                    "header": "FXXG_HIGH_PRICE",
                    "key": "FXXG_HIGH_PRICE",
                    "width": 10
                },
                {
                    "header": "FXXG_OFFLINE_VAP_RATIO",
                    "key": "FXXG_OFFLINE_VAP_RATIO",
                    "width": 10
                },
                {
                    "header": "FXXG_ONLINE_ISSUE_LWR",
                    "key": "FXXG_ONLINE_ISSUE_LWR",
                    "width": 10
                }
            ],
            rows: info,
        }
    ];

    // 自动导出表格到本地
    await ExcelMod.getWorkbook({
        excelPath: './data/stockTable.xlsx',
        excelData: excelInfo,
    });
}
module.exports = createTable