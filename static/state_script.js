$(document).ready(function () {
    const time_series_url = 'https://api.covid19india.org/v4/min/timeseries.min.json';
    /* Format: https://api.covid19india.org/v4/min/timeseries-{state_code}.min.json */

    const url = 'https://api.covid19india.org/v4/min/data.min.json'
    const state_code = {
        'AN': 'Andaman and Nicobar', 'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam', 'BR': 'Bihar', 'TT': 'Total',
        'CH': 'Chandigarh', 'CT': 'Chattisgarh', 'DL': 'Delhi', 'DN': 'Dadra and Nagar Haveli', 'GA': 'Goa', 'GJ': 'Gujarat',
        'HP': 'Himachal Pradesh', 'HR': 'Haryana', 'JH': 'Jharkhand', 'JK': 'Jammu and Kashmir', 'KA': 'Karnataka', 'KL': 'Kerala',
        'LA': 'Ladakh', 'LD': 'Lakshadweep', 'MH': 'Maharashtra', 'ML': 'Meghalaya', 'MN': 'Manipur', 'MP': 'Madhya Pradesh',
        'MZ': 'Mizoram', 'NL': 'Nagaland', 'OR': 'Odisha', 'PB': 'Punjab', 'PY': 'Puducherry', 'RJ': 'Rajasthan', 'SK': 'Sikkim',
        'TG': 'Telangana', 'TN': 'Tamil Nadu', 'TR': 'Tripura', 'UP': 'Uttar Pradesh', 'UT': 'Uttarakhand', 'WB': 'West Bengal'
    };




    /* Function that plots the time series data  */
    function plot_time_series_data(state) {
        let urls = 'https://api.covid19india.org/v4/min/timeseries-' + state + '.min.json';
        let date_range = []
        let confirmed_cases = []
        let deceased_cases = []
        let recovered_cases = []
        let active_cases = []

        Plotly.d3.json(urls, function (figure) {
            let data = figure[state]['dates'];
            $.each(data, function (item) {
                //console.log(data[item]['total']);
                //console.log(item);
                date_range.push(item);
                confirmed_cases.push(data[item]['total']['confirmed']);
                deceased_cases.push(data[item]['total']['deceased']);
                recovered_cases.push(data[item]['total']['recovered']);
                active_cases.push(data[item]['total']['confirmed'] - data[item]['total']['recovered'] - data[item]['total']['deceased'])
            });
            let trace = {
                x: date_range,
                y: confirmed_cases,
                marker: { color: 'blue' },
                mode: 'lines+markers',
                name: 'Confirmed'
            }

            let trace1 = {
                x: date_range,
                y: deceased_cases,
                marker: { color: 'red' },
                mode: 'lines+markers',
                name: 'Deceased'
            }

            let trace2 = {
                x: date_range,
                y: recovered_cases,
                marker: { color: 'green' },
                mode: 'lines+markers',
                name: 'Recovered'
            }

            let trace4 = {
                x: date_range,
                y: active_cases,
                marker: { color: '#f05be8' },
                mode: 'lines+markers',
                name: 'Active'
            }

            let layout = {
                title: 'COVID-19 Data - ' + state_code[state],
                yaxis: { title: 'Cases' },
                xaxis: { title: 'Date' }
            }
            Plotly.plot('myDiv', [trace, trace1, trace2, trace4], layout, { displayModeBar: true });

        });
    }



    function show_state_data(state_id) {
        $.getJSON(url, function (data) {
            // Last Updated date of State data
            var state_updated_date = data[state_id]['meta']['last_updated'];
            //alert(state_updated_date);
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
                $('.state_main_table').append(row);
            });

            var state_today_confirmed = state['delta7']['confirmed'] == undefined ? 0 : state['delta7']['confirmed'].toLocaleString('en-IN');
            var state_today_deceased = state['delta7']['deceased'] == undefined ? 0 : state['delta7']['deceased'].toLocaleString('en-IN');
            var state_today_recovered = state['delta7']['recovered'] == undefined ? 0 : state['delta7']['recovered'].toLocaleString('en-IN');
            var state_today_vaccinated = state['delta7']['vaccinated'] == undefined ? 0 : state['delta7']['vaccinated'].toLocaleString('en-IN');
            var state_today_tested = state['delta7']['tested'] == undefined ? 0 : state['delta7']['tested'].toLocaleString('en-IN');


            var row = '<tr style="background-color: lightyellow; font-weight: 700;"><td><strong>Total</strong></td><td>' + state_total + '<small class="confirmed">(+' + state_today_confirmed + ')</small>' + '</td><td>' + state_active.toLocaleString('en-IN') + '</td><td>' + state_deceased + '<small class="deceased">(+' + state_today_deceased + ')</small>' + '</td><td>' + state_recovered + '<small class="recovered">(+' + state_today_recovered + ')</small>' + '</td><td>' + state_tested + '<small class="tested">(+' + state_today_tested + ')</small>' + '</td><td>' + state_vaccinated + '<small class="vaccinated">(+' + state_today_vaccinated + ')</small>' + '</td></tr>';
            $('.state_main_table').append(row);
        });
        plot_time_series_data(state_id);
    };
    state_id = $('.state_main_table').attr('id');
    show_state_data(state_id);
});
