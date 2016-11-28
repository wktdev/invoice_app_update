var page = require('webpage').create();
page.paperSize = {
    width: '12in',
    height: '11in'

}
page.open('http://localhost:3000', function(status) {

    var date = new Date();
    var currentDate = (date.getUTCMonth() + 1) + "_" + date.getUTCDate() + "_" + date.getFullYear();
    var pdfName = "public/invoices/invoice_" + currentDate + ".pdf";

    console.log("Status: " + status);
    if (status === "success") {
        page.render("public/invoices/invoice_" + currentDate + ".pdf");
    }
    phantom.exit();
});