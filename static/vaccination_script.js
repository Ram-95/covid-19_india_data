$(document).ready(function () {
    var today;

    async function getdata(pin_code, date) {
        $('#vaccine_table').css("visibility", "hidden");
        $('#preload_vaccine').css("display", "block");
        $('#preload_vaccine').css("visibility", "visible");
        
        const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pin_code + "&date=" + date;
        const response = await fetch(url);
        var data = await response.json();
        //console.log(data['sessions'].length);
        $("#vaccine_table > tbody").empty();
        if (data['sessions'].length == 0) {
            $('#preload_vaccine').css("display", "block");
            $('#preload_vaccine').css("visibility", "visible");
            alert('No Data Available');
            $('#preload_vaccine').css("display", "none");
        }
        else {
            //$("#vaccine_table > tbody").empty();
            for (const i in data['sessions']) {
                let temp = data['sessions'][i];
                //console.log(temp);
                let centre_id = temp['center_id'];
                let centre_name = temp['name'];
                let address = temp['address'];
                let district = temp['district_name'];
                let time_slot = temp['from'].slice(0, -3) + ' - ' + temp['to'].slice(0, -3);
                let cls_vaccine;
                if (temp['vaccine'] == 'COVISHIELD') {
                    cls_vaccine = 'CS';
                }
                else if (temp['vaccine'] == 'COVAXIN') {
                    cls_vaccine = 'CX';
                }
                else {
                    cls_vaccine = 'SV';
                }

                let vaccine_name = temp['vaccine'];
                let fee_type;
                if (temp['fee'] != 0) {
                    fee_type = 'Rs. ' + temp['fee'];
                }
                else {
                    fee_type = temp['fee_type'];
                }
                let pincode = temp['pincode'];
                let state = temp['state_name'];
                let capacity = temp['available_capacity'];

                var row = '<tr><td>' + centre_name + ' (' + centre_id + ')' + '</td><td class="vaccine_name ' + cls_vaccine + '">' + vaccine_name + '<br><hr><small class="avl_doses">Doses: ' + capacity + '</small></td><td>' + time_slot + '</td><td>' + address + '</td><td>' + fee_type + '</td></tr>';
                $('#heading').text('Vaccination Centres - ' + pincode + " | " + state);
                $('#vaccine_table').append(row);
            }
            $('#preload_vaccine').css("visibility", "hidden");
            $('#preload_vaccine').css("display", "none");
            $('#vaccine_table').css("visibility", "visible");
        }

    };


    $('#pin_search').on("click", function () {
        var pin_code = $('#pin_field').val();
        if (pin_code.length == 0) {
            alert('Enter a PIN.')
        }
        else if (pin_code.length < 6 || !(new RegExp('^[0-9]+$').test(pin_code))) {
            alert('Not a Valid PIN Code.');
        }
        else {
            today = moment(new Date()).format('DD-MM-YYYY');
            getdata(pin_code, today);

        }

    });

    $("#pin_field").keypress(function (e) {
        if (e.which == 13) {
            $("#pin_search").click();
        }
    });
});