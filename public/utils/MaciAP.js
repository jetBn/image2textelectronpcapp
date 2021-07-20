

const fs = require('fs');
const { inAppPurchase } = require('electron')
const {
    ipcMain
} = require('electron')
const PRODUCT_IDS = ['vip1_1month', 'vip1_3month', 'vip1_6month', 'vip1_12month']

inAppPurchase.on('transactions-updated', (event, transactions) => {
    console.log('transactions-updated')
    if (!Array.isArray(transactions)) {
        return
    }
    // Check each transaction.
    transactions.forEach(function (transaction) {
        var payment = transaction.payment
        console.log(transaction.transactionState)
        let receiptURL ;
        switch (transaction.transactionState) {
        case 'purchasing':
            console.log(`Purchasing ${payment.productIdentifier}...`)
            break
        case 'purchased':
            console.log(`${payment.productIdentifier} purchased.`)
            // Get the receipt url.
            // base64 encode the receipt data
            //var receiptEncoded = receiptRaw.toString('base64')

            // submit the receipt file to the server and check if it is valid

            // Submit the receipt file to the server and check if it is valid.
            // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
            // ...
            // If the receipt is valid, the product is purchased
            // ...
            // Finish the transaction.
            inAppPurchase.finishTransactionByDate(transaction.transactionDate)

            console.log(transaction)
            receiptURL = inAppPurchase.getReceiptURL()
            console.log(`Receipt URL: ${receiptURL}`)

            var receiptRaw = fs.readFileSync(receiptURL)
            console.log(receiptRaw)
            break
        case 'failed':
            console.log(transaction)
            console.log(`Failed to purchase ${payment.productIdentifier}.`)
            // Finish the transaction.
            inAppPurchase.finishTransactionByDate(transaction.transactionDate)
            break
        case 'restored':
            console.log(`The purchase of ${payment.productIdentifier} has been restored.`)
            receiptURL = inAppPurchase.getReceiptURL()
            console.log(`Receipt URL: ${receiptURL}`)

            var receiptRaw = fs.readFileSync(receiptURL)
            console.log(receiptRaw)
            break
        case 'deferred':
            console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)
            break
        default:
            break
        }
    })
})

var iAP  =  {
    // productIDs : ,
    canMakePayment:()=> {
        // 检查用户是否允许当前app启用应用内购买功能.
        return inAppPurchase.canMakePayments();
    },
    getProducts: async () => {
        try{
            var products = await inAppPurchase.getProducts(PRODUCT_IDS)
            if (products.length > 0)
            {
                //ipcMain.send("iap_product_get_success",products)
                console.log("iap get success")
                return products
            }else{
                return []
                console.log("iap get failed")
                //ipcMain.send("iap_product_get_success","products empty")
                // Product get failed
            }
        }catch(e){
            console.log(e)
            console.log("iap get failed in catch")
            //ipcMain.send("iap_product_get_success",e)
        }
    },
    productPurchase: async (productIdentifier,purchaseQuality = 1)=>{
        try{
            const isProductValid = await inAppPurchase.purchaseProduct(productIdentifier, purchaseQuality)
            console.log(isProductValid)
            if (!isProductValid) {
                console.log('The product is not valid.')
            }else{
                console.log('The payment has been added to the payment queue.')
            }
        }catch(e)
        {
            console.log(e)
        }
    }
}

module.exports =  iAP