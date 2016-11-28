"use strict"

$(function() {



    $("#fileInput").on("change", function() {
        var item = $('#fileInput').get(0).files[0];
        console.log(item);
        var fileExtension = item.name.split('.').pop();

        if (fileExtension === "json") {

            var reader = new FileReader();

            reader.onload = function(e) {
                var dataString = reader.result;
                var data = JSON.parse(dataString);
                appendData(data) // DOM appending function goes here

                console.log(data.totalHours);
            }

            reader.readAsText(item);
            $("#fileInput")[0].value = '';

        } else {
            console.log("Not a JSON file");
        }

    });




    //__________________________________________________________BEGIN DOM Appending

    function appendData(data) {

        $("input[name='full_name']").val(data.fullName);
        $("input[name='address']").val(data.address);
        $("input[name='pay_pal_email']").val(data.payPalEmail);
        $("input[name='start_date']").val(data.startDate);
        $("input[name='end_date']").val(data.endDate);
        $(".quantity-total").val(data.totalHours);

        $(".totals-total").val(data.totalPayment);

        var numberOfEntries = data.entries;

        if (data.totalPayment[0] === "$") {
            var totalPaymentWithRemovedDollarSignDuplicate = data.totalPayment.substring(1);
        }

        data.totalPayment = totalPaymentWithRemovedDollarSignDuplicate

        numberOfEntries.forEach(function(val, index, arr) {

            if ("date" in val) {

                $(".invoice-items").append('<div class="invoice-item"><ul><li class="offset"><input class="button copy" type="button" value="Copy"></li><li class="offset"><input class="button delete" type="button" value="Delete"></li><li class="offset"><input class="date" type="text" placeholder="Date" value=" ' + val.date + ' "></li><li class="offset"><input class="student" type="text" placeholder="Student" value=" ' + val.student + ' "></li><li class="offset"><input class="rate" type="text" placeholder="Rate" value=" ' + val.rate + ' "></li><li class="offset"><input class="quantity" type="text" placeholder="Quantity" value=" ' + val.quantity + ' "></li><li class="offset"><input class="total" type="text" placeholder="Total" value=" ' + val.total + ' "></li></ul><hr></div>')

                console.log(val.date);
            }



        })



    }









    //___________________________________________________________END DOM Appending

})