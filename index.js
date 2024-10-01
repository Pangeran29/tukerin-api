const data = [
    {
        "type": "gopay",
        "mode": [
            "deeplink"
        ],
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 20000000
    },
    {
        "type": "qris",
        "acquirer": "gopay",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 10000000
    },
    {
        "type": "bca_va",
        "category": "bank_transfer",
        "va_type": "CLOSED_AMOUNT",
        "status": "up",
        "minimum_amount": 10000,
        "maximum_amount": 20000000000
    },
    {
        "type": "echannel",
        "category": "bank_transfer",
        "va_type": "B2C",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 50000000000
    },
    {
        "type": "bni_va",
        "category": "bank_transfer",
        "va_type": "FIXED_PAYMENT",
        "status": "up",
        "minimum_amount": 1
    },
    {
        "type": "bri_va",
        "category": "bank_transfer",
        "va_type": "CLOSED_BILL",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 20000000000
    },
    {
        "type": "permata_va",
        "category": "bank_transfer",
        "va_type": "B2C",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 9999999999
    },
    {
        "type": "cimb_va",
        "category": "bank_transfer",
        "va_type": "CLOSED_PAYMENT",
        "status": "up",
        "minimum_amount": 1
    },
    {
        "type": "other_va",
        "category": "bank_transfer",
        "processor": "bni_va",
        "status": "up",
        "minimum_amount": 1
    },
    {
        "type": "credit_card",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 999999999
    },
    {
        "type": "shopeepay",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 20000000
    },
    {
        "type": "qris",
        "acquirer": "shopeepay",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 10000000
    },
    {
        "type": "other_qris",
        "processor": "gopay",
        "status": "up",
        "minimum_amount": 1,
        "maximum_amount": 10000000
    },
    {
        "type": "alfamart",
        "category": "cstore",
        "status": "up",
        "minimum_amount": 10000,
        "maximum_amount": 5000000
    },
    {
        "type": "indomaret",
        "category": "cstore",
        "status": "up",
        "minimum_amount": 10000,
        "maximum_amount": 5000000
    },
    {
        "type": "akulaku",
        "status": "up",
        "minimum_amount": 5000
    },
    {
        "type": "kredivo",
        "status": "up",
        "minimum_amount": 1
    }
]
const type = data.map(val=> val.type);
console.log(type)