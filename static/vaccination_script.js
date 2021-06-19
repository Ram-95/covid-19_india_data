$(document).ready(function () {
    async function getdata(pin_code, date) {
        const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pin_code + "&date=" + date;
        const response = await fetch(url);
        var data = await response.json();
        //console.log(data['sessions'].length);
        $("#vaccine_table > tbody").empty();
        if (data['sessions'].length == 0) {
            alert('Invalid PINCODE');
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
                let cls_vaccine;
                if(temp['vaccine'] == 'COVISHIELD') {
                    cls_vaccine = 'CS';
                }
                else {
                    cls_vaccine = 'CX';
                }
                let vaccine_name = temp['vaccine'];
                let fee_type = temp['fee_type'];
                let pincode = temp['pincode'];
                let state = temp['state_name'];

                var row = '<tr><td>' + centre_id + '</td><td>' + centre_name + '</td><td class="'+ cls_vaccine + '">' + vaccine_name + '</td><td>' + address + '</td><td>' + district + '</td><td>' + fee_type + '</td></tr>';
                $('#heading').text('Vaccination Centres - ' + pincode + " | " + state);
                $('#vaccine_table').append(row);
            }
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
            let today = moment(new Date()).format('DD-MM-YYYY');
            getdata(pin_code, today);
        }

    });
});