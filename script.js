const url = 'https://api.covid19india.org/v4/min/data.min.json'
const state_code = {
    'AN': 'Andaman and Nicobar', 'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar', 'TT': 'Total',
    'CH': 'Chandigarh', 'CT': 'Chattisgarh', 'DL': 'Delhi', 'DN': 'Dadra and Nagar Haveli', 'GA': 'Goa', 'GJ': 'Gujarat',
    'HP': 'Himachal Pradesh', 'HR': 'Haryana', 'JH': 'Jharkhand', 'JK': 'Jammu and Kashmir', 'KA': 'Karnataka', 'KL': 'Kerala',
    'LA': 'Ladakh', 'LD': 'Lakshadweep', 'MH': 'Maharashtra', 'ML': 'Meghalaya', 'MN': 'Manipur', 'MP': 'Madhya Pradesh',
    'MZ': 'Mizoram', 'NL': 'Nagaland', 'OR': 'Odisha', 'PB': 'Punjab', 'PY': 'Puducherry', 'RJ': 'Rajasthan', 'SK': 'Sikkim',
    'TG': 'Telangana', 'TN': 'Tamil Nadu', 'TR': 'Tripura', 'UP': 'Uttar Pradesh', 'UT': 'Uttarakhand', 'WB': 'West Bengal'
};
var state_show_code;

$(document).ready(function () {
    function fetch_data() {
        $.getJSON(url, function (data) {
            var updated_date = data['TT']['meta']['last_updated'];
            // Adding the updated date
            x = updated_date.split('T');
            $('.updated_date').text(x[0] + ', ' + x[1].split('+')[0] + ' (IST)');

            $.each(data, function (item) {
                var total = data[item]['total'];
                // Total Cases
                var confirmed = total['confirmed'].toLocaleString('en-IN');
                var deceased = total['deceased'].toLocaleString('en-IN');
                var recovered = total['recovered'].toLocaleString('en-IN');
                var tested = total['tested'].toLocaleString('en-IN');
                var vaccinated = total['vaccinated'].toLocaleString('en-IN');
                var active = total['confirmed'] - total['deceased'] - total['recovered'];

                // Today's Data
                if (data[item].delta) {
                    var today_confirmed = data[item]['delta']['confirmed'] == undefined ? 0 : data[item]['delta']['confirmed'].toLocaleString('en-IN');
                    var today_deceased = data[item]['delta']['deceased'] == undefined ? 0 : data[item]['delta']['deceased'].toLocaleString('en-IN');
                    var today_recovered = data[item]['delta']['recovered'] == undefined ? 0 : data[item]['delta']['recovered'].toLocaleString('en-IN');
                    var today_vaccinated = data[item]['delta']['vaccinated'] == undefined ? 0 : data[item]['delta']['vaccinated'].toLocaleString('en-IN');
                    if (item != 'TT') {
                        var row = '<tr><td><a class="state_name" id="' + item + '">' + state_code[item] + ' (' + item + ')</a>' + '</td><td>' + confirmed + '<small class="confirmed">(+' + today_confirmed + ')</small>' + '<td>' + active.toLocaleString('en-IN') + '</td>' + '</td>' + '<td>' + deceased + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + recovered + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + tested + '</td><td>' + vaccinated + '<small class="vaccinated">(+' + today_vaccinated + ')</small>' + '</td></tr>';
                    }

                    //console.log(item, data[item]['delta']);
                }
                else if (data[item].delta7) {
                    var today_confirmed = data[item]['delta7']['confirmed'] == undefined ? 0 : data[item]['delta7']['confirmed'].toLocaleString('en-IN');
                    var today_deceased = data[item]['delta7']['deceased'] == undefined ? 0 : data[item]['delta7']['deceased'].toLocaleString('en-IN');
                    var today_recovered = data[item]['delta7']['recovered'] == undefined ? 0 : data[item]['delta7']['recovered'].toLocaleString('en-IN');
                    var today_vaccinated = data[item]['delta7']['vaccinated'] == undefined ? 0 : data[item]['delta7']['vaccinated'].toLocaleString('en-IN');
                    var today_tested = data[item]['delta7']['tested'] == undefined ? 0 : data[item]['delta7']['tested'].toLocaleString('en-IN');

                    var row = '<tr><td><a class="state_name" id="' + item + '">' + state_code[item] + ' (' + item + ')</a>' + '</td><td>' + confirmed + '<small class="confirmed">(+' + today_confirmed + ')</small>' + '</td><td>' + active.toLocaleString('en-IN') + '</td><td>' + deceased + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + recovered + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + tested + '<small class="tested">(+' + today_tested + ')</small></td><td>' + vaccinated + '<small class="vaccinated">(+' + today_vaccinated + ')</small>' + '</td></tr>';
                }
                $('.main_table').append(row);
                //console.log(item, data[item]);

            });
            // Appending the Total figures at the last

            var today_confirmed = data['TT']['delta']['confirmed'] == undefined ? 0 : data['TT']['delta']['confirmed'].toLocaleString('en-IN');
            var today_deceased = data['TT']['delta']['deceased'] == undefined ? 0 : data['TT']['delta']['deceased'].toLocaleString('en-IN');
            var today_recovered = data['TT']['delta']['recovered'] == undefined ? 0 : data['TT']['delta']['recovered'].toLocaleString('en-IN');
            var today_vaccinated = data['TT']['delta']['vaccinated'] == undefined ? 0 : data['TT']['delta7']['vaccinated'].toLocaleString('en-IN');
            var today_tested = data['TT']['delta']['tested'] == undefined ? 0 : data['TT']['delta7']['tested'].toLocaleString('en-IN');
            var today_active = data['TT']['total']['confirmed'] - data['TT']['total']['deceased'] - data['TT']['total']['recovered'];

            var row = '<tr style="background-color: lightyellow; font-weight: 700;"><td><a>' + state_code['TT'] + ' (' + 'TT' + ')</a>' + '</td><td>' + data['TT']['total']['confirmed'].toLocaleString('en-IN') + '<small class="confirmed">(+' + today_confirmed + ')</small></td><td>' + today_active.toLocaleString('en-IN') + '</td>' + '<td>' + data['TT']['total']['deceased'].toLocaleString('en-IN') + '<small class="deceased">(+' + today_deceased + ')</small>' + '</td><td>' + data['TT']['total']['recovered'].toLocaleString('en-IN') + '<small class="recovered">(+' + today_recovered + ')</small>' + '</td><td>' + data['TT']['total']['tested'].toLocaleString('en-IN') + ' <small class="tested">(+' + today_tested + ')</small></td><td>' + data['TT']['total']['vaccinated'].toLocaleString('en-IN') + '<small style="color: blue;">(+' + today_vaccinated + ')</small>' + '</td></tr>';
            $('.main_table').append(row);

        });
        $('.footer > small').text('Source: ' + url);
    }
    fetch_data();

    function show_state_data(state_id) {
        $('.main_heading').text(state_code[state_id]);
        $('#main_table tbody').empty();
        $('th:first').text('District Name');

        $.getJSON(url, function (data) {
            // Last Updated date of State data
            var state_updated_date = data[state_id]['meta']['last_updated'];
            //console.log(data[state_id]);
            x = state_updated_date.split('T');
            $('.updated_date').text(x[0] + ', ' + x[1].split('+')[0] + ' (IST)');

            var district = data[state_id]['districts'];

            /* Total Data of State */
            var state = data[state_id];
            var state_total = state['total']['confirmed'].toLocaleString('en-IN');
            var state_deceased = state['total']['deceased'].toLocaleString('en-IN');
            var state_recovered = state['total']['recovered'].toLocaleString('en-IN');
            var state_tested = state['total']['tested'].toLocaleString('en-IN');
            var state_active = state['total']['confirmed'] - state['total']['deceased'] - state['total']['recovered'];
            var state_vaccinated = state['total']['vaccinated'].toLocaleString('en-IN');

            /* Fetching the District data of the State. */
            $.each(district, function (item) {
                var dist = district[item];
                //console.log(item, dist['delta7']);
                var dist_confirmed = dist['total']['confirmed'] == undefined ? 0 : dist['total']['confirmed'].toLocaleString('en-IN');
                var dist_deceased = dist['total']['deceased'] == undefined ? 0 : dist['total']['deceased'].toLocaleString('en-IN');
                var dist_recovered = dist['total']['recovered'] == undefined ? 0 : dist['total']['recovered'].toLocaleString('en-IN');
                var dist_tested = dist['total']['tested'] == undefined ? 0 : dist['total']['tested'].toLocaleString('en-IN');
                var dist_active = dist['total']['confirmed'] - dist['total']['recovered'] - dist['total']['deceased'];

                // Today's data of districts
                var today_dist_data = dist['delta7'] == undefined ? 0 : dist['delta7'];
                if (today_dist_data != 0) {
                    var today_dist_confirmed = today_dist_data['confirmed'] == undefined ? 0 : today_dist_data['confirmed'].toLocaleString('en-IN');
                    var today_dist_deceased = today_dist_data['deceased'] == undefined ? 0 : today_dist_data['deceased'].toLocaleString('en-IN');
                    var today_dist_recovered = today_dist_data['recovered'] == undefined ? 0 : today_dist_data['recovered'].toLocaleString('en-IN');
                }
                else {
                    var today_dist_confirmed = 0;
                    var today_dist_deceased = 0;
                    var today_dist_recovered = 0;
                }

                var row = '<tr><td style="font-weight: 500; color: #630bd8;">' + item + '</td><td>' + dist_confirmed + ' <small class="confirmed">(+' + today_dist_confirmed + ')</small></td><td>' + dist_active.toLocaleString('en-IN') + '</td><td>' + dist_deceased + '<small class="deceased">(+' + today_dist_deceased + ')</small></td><td>' + dist_recovered + '<small class="recovered">(+' + today_dist_recovered + ')</small></td><td>' + dist_tested + '</td><td>' + 'NA' + '</td></tr>';
                $('.main_table').append(row);
            });

            var state_today_confirmed = state['delta7']['confirmed'] == undefined ? 0 : state['delta7']['confirmed'].toLocaleString('en-IN');
            var state_today_deceased = state['delta7']['deceased'] == undefined ? 0 : state['delta7']['deceased'].toLocaleString('en-IN');
            var state_today_recovered = state['delta7']['recovered'] == undefined ? 0 : state['delta7']['recovered'].toLocaleString('en-IN');
            var state_today_vaccinated = state['delta7']['vaccinated'] == undefined ? 0 : state['delta7']['vaccinated'].toLocaleString('en-IN');
            var state_today_tested = state['delta7']['tested'] == undefined ? 0 : state['delta7']['tested'].toLocaleString('en-IN');


            var row = '<tr style="background-color: lightyellow; font-weight: 700;"><td><strong>Total</strong></td><td>' + state_total + '<small class="confirmed">(+' + state_today_confirmed + ')</small>' + '</td><td>' + state_active.toLocaleString('en-IN') + '</td><td>' + state_deceased + '<small class="deceased">(+' + state_today_deceased + ')</small>' + '</td><td>' + state_recovered + '<small class="recovered">(+' + state_today_recovered + ')</small>' + '</td><td>' + state_tested + '<small class="tested">(+' + state_today_tested + ')</small>' + '</td><td>' + state_vaccinated + '<small class="vaccinated">(+' + state_today_vaccinated + ')</small>' + '</td></tr>';
            $('.main_table').append(row);
        });
    };

    $('body').on('click', '.state_name', function () {
        state_show_code = $(this).attr('id');
        //alert(state_show_code);
        show_state_data(state_show_code);
    });

});