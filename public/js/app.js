"use strict"

$(function() {

    var $totalPayment = 0;
    var $totalHoursQuantity = 0;


    //_________________________________________________BEGIN data structures

    var newInvoice = {
        fullName: undefined,
        address: undefined,
        payPalEmail: undefined,
        startDate: undefined,
        endDate: undefined,
        totalHours: 0,
        totalPayment: 0,

        entries: [


        ]

    };

    var invoiceDataStructure = {
        date: undefined,
        student: undefined,
        rate: undefined,
        quantity: undefined,
        total: undefined,
        DOM_id: undefined
    };

    //_________________________________________________END data structures

    //_________________________________________________START Datepicker

    $('body').on('mousedown', ".date", function() {
        $(this).datepicker({
            dateFormat: 'mm-dd-yy'
        });
    });

    //_________________________________________________END Datepicker



    //_________________________________________________BEGIN create item


    $(".create-item").on("click", function() {
        $(".invoice-items").append('<div class="invoice-item"><ul><li class="offset"><input class="button copy" type="button" value="Copy"></li><li class="offset"><input class="button delete" type="button" value="Delete"></li><li class="offset"><input class="date" type="text" placeholder="Date"></li><li class="offset"><input class="student" type="text" placeholder="Student" value=""></li><li class="offset"><input class="rate" type="text" placeholder="Rate" value=""></li><li class="offset"><input class="quantity" type="text" placeholder="Quantity" value=""></li><li class="offset"><input class="total" type="text" placeholder="Total" value=""></li></ul><hr></div>')
    })

    //_________________________________________________END create item

    //_________________________________________________BEGIN delete item

    $(document).on("click", ".delete", function() {
        $(this).closest(".invoice-item").remove();

        //________________________BEGIN Updates Total-totals
        var itemTotal = 0;
        $(".total").each(function() {

            itemTotal += +$(this).val();


        })

        $(".totals-total").val(itemTotal)
        //_______________________END Updates Total-totals



        //_______________________BEGIN Updates Quantity totals

        var quantTotal = 0;
        $(".quantity").each(function() {

            quantTotal += +$(this).val();


        })

        $(".quantity-total").val(quantTotal)

        //_______________________END Updates Quantity totals
    })
    //_________________________________________________END delete item

    //_________________________________________________BEGIN copy item


    $(document).on("click", ".copy", function() {
        var index = $(this).closest(".invoice-item").index();
        var invoiceClone = $(this).closest(".invoice-item").clone();

        $(this).closest(".invoice-item").after(invoiceClone);


        //________________________BEGIN Updates Total-totals
        var itemTotal = 0;
        $(".total").each(function() {

            itemTotal += +$(this).val();


        })

        $(".totals-total").val(itemTotal)
        //_______________________END Updates Total-totals



        //_______________________BEGIN Updates Quantity totals

        var quantTotal = 0;
        $(".quantity").each(function() {

            quantTotal += +$(this).val();


        })

        $(".quantity-total").val(quantTotal)

        //_______________________END Updates Quantity totals


    })

    //_________________________________________________END copy item



    //_________________________________________________BEGIN submit invoice

    $(document).on("click", ".complete", function(e) {
        e.preventDefault();

        var lastIndexValue = $(".invoice-item").last().index();
        newInvoice.entries = [];


        newInvoice.fullName = $("input[name='full_name']").val()
        newInvoice.address = $("input[name='address']").val()
        newInvoice.payPalEmail = $("input[name='pay_pal_email']").val()
        newInvoice.startDate = $("input[name='start_date']").val()
        newInvoice.endDate = $("input[name='end_date']").val()
        newInvoice.totalHours = $(".quantity-total").val()

        newInvoice.totalPayment = "$" + $(".totals-total").val()


        for (var i = 0; i < (lastIndexValue); i += 1) {
            var invoiceItem = Object.create(invoiceDataStructure)

            invoiceItem.DOM_id = i;
            invoiceItem.date = $(".invoice-item:eq('" + i + "') .date").val();
            invoiceItem.student = $(".invoice-item:eq('" + i + "') .student").val();
            console.log(invoiceItem.student);
            invoiceItem.rate = $(".invoice-item:eq('" + i + "') .rate").val();
            invoiceItem.quantity = $(".invoice-item:eq('" + i + "') .quantity").val();
            invoiceItem.total = $(".invoice-item:eq('" + i + "') .total").val();
            newInvoice.entries.push(invoiceItem);

            console.log(invoiceItem);
        }




        console.log(newInvoice);

        $.ajax({
            type: "POST",
            url: "/",

            data: JSON.stringify(

                newInvoice
            ), // has to be a property of a property in the synth schema
            contentType: 'application/json',
            success: function(data) {

                function downloadPDF() {
                    $(location).attr('href', '/download');
                }


                window.setTimeout(downloadPDF, 4000);







            }
        })




    })


    var $loading = $('#loadingDiv').hide();
    $(document)
        .ajaxStart(function() {
            $loading.show();
            $('.app').hide();
        })
        .ajaxStop(function() {

            function pause() {
                $loading.hide()
            };

            function hider() {
                $('.app').show();
            }

            window.setTimeout(pause, 3500);
            window.setTimeout(hider, 3500);

        });





    //_________________________________________________END submit invoice


    //_________________________________________________START set date range

    $('[name="start_date"]').datepicker({
        dateFormat: 'mm-dd-yy'
    });
    $('[name="end_date"]').datepicker({
        dateFormat: 'mm-dd-yy'
    });


    $(".create-batch").on("click", function(e) {
        e.preventDefault();


        var start = $('[name="start_date"]').datepicker('getDate');
        var end = $('[name="end_date"]').datepicker('getDate');
        var currentDate = new Date(start);
        var formattedDate = undefined

        while (currentDate <= end) {
            formattedDate = $.datepicker.formatDate('mm-dd-yy', new Date(currentDate));
            console.log(formattedDate);
            $(".invoice-items").append(
                '<div class="invoice-item"><ul><li class="offset"><input class="button copy" type="button" value="Copy"></li><li class="offset"><input class="button delete" type="button" value="Delete"></li><li class="offset"><input class="date" type="text" value=' + "'" + formattedDate + "'" + '></li><li class="offset"><input class="student" type="text" value=""></li><li class="offset"><input class="rate" type="text" value=""></li><li class="offset"><input class="quantity" type="text" value=""></li><li class="offset"><input class="total" type="text" value=""></li></ul><hr></div>'

            )
            currentDate.setDate(currentDate.getDate() + 1);

        }



    })


    //____________________________________________________END date range

    //____________________________________________________START Set rate enmass

    function setRateAllFields() {
        var rate = undefined;


        $("#rate-dialog").dialog({
            autoOpen: false,
            show: {
                effect: "show",
                duration: 1000
            },
            hide: {
                effect: "hide",
                duration: 1000
            }
        }).keydown(function(e) {
            if (e.keyCode == 13) {
                rate = $("#rate-set-all").val();
                $("#rate-dialog").dialog('close');
                $(".rate").val(rate)
            }

            $('.invoice-item').each(function() {
                var rate = $(".invoice-item .rate").val();
                var quantity = $(".invoice-item .quantity").val();
                var total = rate * quantity;
                $(".invoice-item .total").val(total);
                // calculate total

                $(".total").each(function() {

                    $totalPayment += +$(this).val();

                    $(".totals-total").val($totalPayment)
                })

                $totalPayment = 0;


                $(".quantity").each(function() {

                    $totalHoursQuantity += +$(this).val();

                    $(".quantity-total").val($totalHoursQuantity)
                })

                $totalHoursQuantity = 0;


            });







        });



        $(".rate-heading").click(function() {
            $("#rate-dialog").dialog("open");

        })


    }

    setRateAllFields()
    //____________________________________________________END Set rate enmass

    //____________________________________________________START Set quantity enmass

    function setQuantityAllFields() {
        var quantity = undefined;
        $("#quantity-dialog").dialog({
            autoOpen: false,
            show: {
                effect: "show",
                duration: 1000
            },
            hide: {
                effect: "hide",
                duration: 1000
            }
        }).keydown(function(e) {
            if (e.keyCode == 13) {
                quantity = $("#quantity-set-all").val();
                $("#quantity-dialog").dialog('close');
                $(".quantity").val(quantity)
            }

            $('.invoice-item').each(function() {
                var rate = $(".invoice-item .rate").val();
                var quantity = $(".invoice-item .quantity").val();
                var total = rate * quantity;
                $(".invoice-item .total").val(total);
                // calculate total


            });

            $(".total").each(function() {

                $totalPayment += +$(this).val();

                $(".totals-total").val($totalPayment)
            })

            $totalPayment = 0;


            $(".quantity").each(function() {

                $totalHoursQuantity += +$(this).val();

                $(".quantity-total").val($totalHoursQuantity)
            })

            $totalHoursQuantity = 0;
        });



        $(".quantity-heading").click(function() {
            $("#quantity-dialog").dialog("open");

        })


    }

    setQuantityAllFields()

    //________________________________________________________END Set quantity enmass

    //________________________________________________________START Autocomplete for student fields
    function autoComplete() {
        var students = [];
        $("body").on("blur", ".student", function() {


            students.push($(this).val())

        }).on("focus", ".student", function() {

            $(".student").autocomplete({
                source: students
            });
        })

        $("body").mousedown(function() {
            students = students.reduce(function(a, b) {
                if (a.indexOf(b) < 0) a.push(b);
                return a;
            }, []);
        })

        return students
    }
    autoComplete()
    //__________________________________________________________END Autocomplete for student fields



    $(".create-item").hover(
        function() {
            $(this).addClass("hover");
        }, function() {
            $(this).removeClass("hover");
        }
    );

    $(".create-batch").hover(
        function() {
            $(this).addClass("hover");
        }, function() {
            $(this).removeClass("hover");
        }
    );




    //____________________________________________________________START rate/quantity calculation



    $("body").on("keyup", ".invoice-item", function() {
        var $rateVal = $(this).find(".rate").val();
        var $quantityVal = $(this).find(".quantity").val();


        var totalTally = $rateVal * $quantityVal;

        $(this).find(".total").val(totalTally)

        $(".total").each(function() {

            $totalPayment += +$(this).val();

            $(".totals-total").val($totalPayment)
        })

        $totalPayment = 0;



        $(".quantity").each(function() {

            $totalHoursQuantity += +$(this).val();

            $(".quantity-total").val($totalHoursQuantity)
        })

        $totalHoursQuantity = 0;


    });







    //_____________________________________________________________END rate/quantity calculation



})