
const { inAppPurchase } = require('electron').remote
const PRODUCT_IDS = ['vip1_1month', 'vip1_3month', 'vip1_6month', 'vip1_12month']



let getProducts:() =>{

}

// 尽早监听transactions事件.
inAppPurchase.on('transactions-updated', (event, transactions) => {
  if (!Array.isArray(transactions)) {
    return
  }

  // 检查每一笔交易.
  transactions.forEach(function (transaction) {
    let payment = transaction.payment

    switch (transaction.transactionState) {
      case 'purchasing':
        console.log(`Purchasing ${payment.productIdentifier}...`)
        break
      case 'purchased':

        console.log(`${payment.productIdentifier} purchased.`)

        // Get the receipt url.
        let receiptURL = inAppPurchase.getReceiptURL()

        console.log(`Receipt URL: ${receiptURL}`)

        // 将收据提交到服务器并校验收据是否有效.
        // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
        // ...
        // 如果收据通过校验，说明产品已经被购买了
        // ...

        // 交易完成.
        inAppPurchase.finishTransactionByDate(transaction.transactionDate)

        break
      case 'failed':

        console.log(`Failed to purchase ${payment.productIdentifier}.`)

        // 交易完成.
        inAppPurchase.finishTransactionByDate(transaction.transactionDate)

        break
      case 'restored':

        console.log(`The purchase of ${payment.productIdentifier} has been restored.`)

        break
      case 'deferred':

        console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)

        break
      default:
        break
    }
  })
})

// 检查用户是否允许当前app启用应用内购买功能.
if (!inAppPurchase.canMakePayments()) {
  console.log('The user is not allowed to make in-app purchase.')
}

// 检索并显示产品描述.
inAppPurchase.getProducts(PRODUCT_IDS).then(products => {
  // 检查参数.
  if (!Array.isArray(products) || products.length <= 0) {
    console.log('Unable to retrieve the product informations.')
    return
  }

  // 显示每个产品的名称和价格.
  products.forEach(product => {
    console.log(`The price of ${product.localizedTitle} is ${product.formattedPrice}.`)
  })

  // 询问用户需要购买哪个产品.
  let selectedProduct = products[0]
  let selectedQuantity = 1

  // 购买选中的产品.
  inAppPurchase.purchaseProduct(selectedProduct.productIdentifier, selectedQuantity).then(isProductValid => {
    if (!isProductValid) {
      console.log('The product is not valid.')
      return
    }

    console.log('The payment has been added to the payment queue.')
  })
})