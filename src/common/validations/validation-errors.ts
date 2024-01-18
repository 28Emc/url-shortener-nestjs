export const CustomValidationErrors = {
    "user": {
        "email": {
            "isEmail": "Invalid email"
        },
        "username": {
            "isNotEmpty": "Username required"
        },
        "password": {
            "isNotEmpty": "Password required"
        },
        "status": {
            "isEnum": "Password required"
        },
        "createdBy": {
            "isNotEmpty": "Created by user required"
        },
        "modifiedBy": {
            "isNotEmpty": "Modified by user required"
        }
    },
    "url": {
        "urlId": {
            "isNotEmpty": "Url ID required"
        },
        "uuid": {
            "isNotEmpty": "UUID required"
        },
        "userId": {
            "isNotEmpty": "User ID required"
        },
        "originalUrl": {
            "isNotEmpty": "Original url required"
        },
        "shortUrl": {
            "isNotEmpty": "Short url required"
        },
        "clickNro": {
            "isNumber": "Click nro must be a number",
            "isPositive": "Click nro must be a number greater than zero"
        },
        "createdBy": {
            "isNotEmpty": "Created by url required"
        },
        "modifiedBy": {
            "isNotEmpty": "Modified by url required"
        }
    },
    "statistic": {
        "urlId": {
            "isNotEmpty": "Url ID required"
        },
        "uuid": {
            "isNotEmpty": "UUID required"
        },
        "browserInfo": {
            "isNotEmpty": "Browser info required"
        },
        "locationInfo": {
            "isNotEmpty": "Location info required"
        }
    }
}