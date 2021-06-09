function stop_loading() {
    $('#preload').fadeOut('fast');
}

$(document).ready(function () {
    var dist_active_bar = [];
    var dist_names_bar = [];
    var dist_confirmed_bar = [];
    var dist_recovered_bar = [];

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


    function plot_time_series_data(state, typeOfGraph, plotlyGraphDiv) {
        let urls = 'https://api.covid19india.org/v4/min/timeseries-' + state + '.min.json';
        let date_range = []
        let confirmed_cases = []
        let deceased_cases = []
        let recovered_cases = []
        let active_cases = []
        let filter;
        let mode = 'lines';


        if (typeOfGraph == 'Cummulative') {
            filter = 'total';
        }
        else if (typeOfGraph == 'Daily') {
            filter = 'delta';
        }


        Plotly.d3.json(urls, function (figure) {
            let data = figure[state]['dates'];
            //console.log(data);
            $.each(data, function (item) {
                if (data[item][filter] != undefined) {
                    date_range.push(item);
                    confirmed_cases.push(data[item][filter]['confirmed']);
                    deceased_cases.push(data[item][filter]['deceased']);
                    recovered_cases.push(data[item][filter]['recovered']);
                    active_cases.push(data[item][filter]['confirmed'] - data[item][filter]['recovered'] - data[item][filter]['deceased'])
                }
            });
            var trace1 = {
                x: date_range,
                y: confirmed_cases,
                marker: { color: 'blue' },
                mode: mode,
                name: 'Confirmed'
            }

            var trace2 = {
                x: date_range,
                y: deceased_cases,
                xaxis: 'x2',
                yaxis: 'y2',
                marker: { color: 'red' },
                mode: mode,
                name: 'Deceased'
            }

            var trace3 = {
                x: date_range,
                y: recovered_cases,
                xaxis: 'x3',
                yaxis: 'y3',
                marker: { color: 'green' },
                mode: mode,
                name: 'Recovered'
            }

            var trace4 = {
                x: date_range,
                y: active_cases,
                xaxis: 'x4',
                yaxis: 'y4',
                marker: { color: '#f05be8' },
                mode: mode,
                name: 'Active'
            }

            var layout = {
                grid: { rows: 2, columns: 2, pattern: 'independent' },
                title: state_code[state] + ' (' + typeOfGraph + ')'
            };

            Plotly.react(plotlyGraphDiv, [trace1, trace2, trace3, trace4], layout, { displayModeBar: false });

        });
    }

    // Sorting based on the confirmed cases of a district of a state and plots the district level bar graph
    function sort_and_store(district_data, dist_names_bar, dist_confirmed_bar, dist_active_bar, dist_recovered_bar) {
        district_data.sort(function (a, b) {
            if (a[1] < b[1]) {
                return 1
            }
            else if (a[1] > b[1]) {
                return -1
            }
            return 0;
        });
        for (var i = 0; i < district_data.length; i++) {
            dist_names_bar.push(district_data[i][0]);
            dist_confirmed_bar.push(district_data[i][1]);
            dist_active_bar.push(district_data[i][3]);
            dist_recovered_bar.push(district_data[i][2]);
        }
        // Plots the bar-graph
        district_bar_chart(dist_names_bar, dist_confirmed_bar, dist_active_bar, dist_recovered_bar);
    }


    function show_state_data(state_id) {
        $.getJSON(url, function (data) {
            // Last Updated date of State data
            var state_updated_date = data[state_id]['meta']['last_updated'];
            $('.updated_date').text(moment(state_updated_date).format('MMMM Do YYYY, h:mm:ss a') + ' (IST)');
            //console.log(data[state_id]);


            var district = data[state_id]['districts'];
            var district_data = [];

            /* Total Data of State */
            var state = data[state_id];

            var state_total = state['total']['confirmed'].toLocaleString('en-IN');
            var state_deceased = state['total']['deceased'].toLocaleString('en-IN');
            var state_recovered = state['total']['recovered'].toLocaleString('en-IN');
            var state_tested = state['total']['tested'].toLocaleString('en-IN');
            var state_active = state['total']['confirmed'] - state['total']['deceased'] - state['total']['recovered'];
            var state_total_vaccinated = (state['total']['vaccinated1'] + state['total']['vaccinated2']).toLocaleString('en-IN');
            var state_vaccinated1 = state['total']['vaccinated1'].toLocaleString('en-IN');
            var state_vaccinated2 = state['total']['vaccinated2'].toLocaleString('en-IN');
            var state_vaccinate1_percentage = Math.round((state['total']['vaccinated1']/state['meta']['population'])*100)
            var state_vaccinate2_percentage = Math.round((state['total']['vaccinated2']/state['meta']['population'])*100)
            //console.log(state_vaccinate1_percentage);

            /* Last 24 hours data */
            var prev_day = data[state_id]['delta'];
            //console.log(prev_day);
            if (prev_day != undefined) {
                var confirmed_24 = prev_day['confirmed'] == undefined ? 0 : prev_day['confirmed'].toLocaleString('en-IN');
                var deceased_24 = prev_day['deceased'] == undefined ? 0 : prev_day['deceased'].toLocaleString('en-IN');
                var recovered_24 = prev_day['recovered'] == undefined ? 0 : prev_day['recovered'].toLocaleString('en-IN');
                $('.confirmed_24 > h3').text(state_total);
                $('.confirmed_24 > small').text('(+'+ confirmed_24 +')')
                $('.deceased_24 > h3').text(state_deceased);
                $('.deceased_24 > small').text('(+'+ deceased_24 +')')
                $('.recovered_24 > h3').text(state_recovered);
                $('.recovered_24 > small').text('(+'+ recovered_24 +')')
                $('.active_24 > h3').text(state_active.toLocaleString('en-IN'));
                //$('.active_24 > small').text('(+' + (Math.abs(prev_day['confirmed'] - prev_day['deceased'] - prev_day['recovered'])).toLocaleString('en-IN')  + ')');
            }
            else {
                $('.confirmed_24 > h3').text(state_total);
                $('.deceased_24 > h3').text(state_deceased);
                $('.recovered_24 > h3').text(state_recovered);
                $('.active_24 > h3').text(state_active.toLocaleString('en-IN'));
            }
            $('.total_doses').text(state_total_vaccinated + ' vaccines administered');
            $('#first_dose').text('First Dose: ' + state_vaccinated1 + ' (' + state_vaccinate1_percentage +'%)');
            $('#second_dose').text('Second Dose: ' + state_vaccinated2 + ' (' + state_vaccinate2_percentage +'%)');
            stop_loading();
            /* Fetching the District data of the State. */
            $.each(district, function (item) {
                var dist = district[item];
                //console.log(item, dist['delta7']);
                var dist_confirmed = dist['total']['confirmed'] == undefined ? 0 : dist['total']['confirmed'].toLocaleString('en-IN');
                var dist_deceased = dist['total']['deceased'] == undefined ? 0 : dist['total']['deceased'].toLocaleString('en-IN');
                var dist_recovered = dist['total']['recovered'] == undefined ? 0 : dist['total']['recovered'].toLocaleString('en-IN');
                var dist_tested = dist['total']['tested'] == undefined ? 0 : dist['total']['tested'].toLocaleString('en-IN');
                var dist_vaccinated = dist['total']['vaccinated'] == undefined ? 0 : dist['total']['vaccinated'].toLocaleString('en-IN');
                var dist_active = Math.abs(dist['total']['confirmed'] - dist['total']['recovered'] - dist['total']['deceased']);

                // Appending the current district data to the district_data array
                district_data.push([
                    item,
                    dist['total']['confirmed'] == undefined ? 0 : dist['total']['confirmed'],
                    dist['total']['recovered'] == undefined ? 0 : dist['total']['recovered'],
                    dist_active
                ]);


                // Today's data of districts
                var today_dist_data = dist['delta'] == undefined ? 0 : dist['delta'];
                if (today_dist_data != 0) {
                    var today_dist_confirmed = today_dist_data['confirmed'] == undefined ? 0 : today_dist_data['confirmed'].toLocaleString('en-IN');
                    var today_dist_deceased = today_dist_data['deceased'] == undefined ? 0 : today_dist_data['deceased'].toLocaleString('en-IN');
                    var today_dist_recovered = today_dist_data['recovered'] == undefined ? 0 : today_dist_data['recovered'].toLocaleString('en-IN');
                    var today_dist_tested = today_dist_data['tested'] == undefined ? 0 : today_dist_data['tested'].toLocaleString('en-IN');
                    var today_dist_vaccinated = today_dist_data['vaccinated'] == undefined ? 0 : today_dist_data['vaccinated'].toLocaleString('en-IN');
                }
                else {
                    var today_dist_confirmed = 0;
                    var today_dist_deceased = 0;
                    var today_dist_recovered = 0;
                    var today_dist_tested = 0;
                    var today_dist_vaccinated = 0;
                }

                var row = '<tr><td style="font-weight: 500; color: #630bd8;">' + item + '</td><td>' + dist_confirmed + ' <small class="confirmed">(+' + today_dist_confirmed + ')</small></td><td>' + dist_active.toLocaleString('en-IN') + '</td><td>' + dist_deceased + '<small class="deceased">(+' + today_dist_deceased + ')</small></td><td>' + dist_recovered + '<small class="recovered">(+' + today_dist_recovered + ')</small></td><td>' + dist_tested + '<small class="tested">(+' + today_dist_tested + ')</small></td><td>' + dist_vaccinated + '<small class="vaccinated">(+' + today_dist_vaccinated + ')</small></td></tr>';
                $('.state_main_table').append(row);
            });

            // Sort the district data based on confirmed cases and plot the district bar graph.
            sort_and_store(district_data, dist_names_bar, dist_confirmed_bar, dist_active_bar, dist_recovered_bar);
            if (state.delta) {
                var state_today_confirmed = state['delta']['confirmed'] == undefined ? 0 : state['delta']['confirmed'].toLocaleString('en-IN');
                var state_today_deceased = state['delta']['deceased'] == undefined ? 0 : state['delta']['deceased'].toLocaleString('en-IN');
                var state_today_recovered = state['delta']['recovered'] == undefined ? 0 : state['delta']['recovered'].toLocaleString('en-IN');
                var state_today_vaccinated = state['delta']['vaccinated'] == undefined ? 0 : state['delta']['vaccinated'].toLocaleString('en-IN');
                var state_today_tested = state['delta']['tested'] == undefined ? 0 : state['delta']['tested'].toLocaleString('en-IN');
            }
            else {
                var state_today_confirmed = 0;
                var state_today_deceased = 0;
                var state_today_recovered = 0;
                var state_today_tested = 0;
                var state_today_vaccinated = 0;
            }

            var row = '<tr style="background-color: lightyellow; font-weight: 700;"><td><strong>Total</strong></td><td>' + state_total + '<small class="confirmed">(+' + state_today_confirmed + ')</small>' + '</td><td>' + state_active.toLocaleString('en-IN') + '</td><td>' + state_deceased + '<small class="deceased">(+' + state_today_deceased + ')</small>' + '</td><td>' + state_recovered + '<small class="recovered">(+' + state_today_recovered + ')</small>' + '</td><td>' + state_tested + '<small class="tested">(+' + state_today_tested + ')</small>' + '</td><td>' + state_total_vaccinated + '<small class="vaccinated">(+' + state_today_vaccinated + ')</small>' + '</td></tr>';
            $('.state_main_table').append(row);
        });
        plot_time_series_data(state_id, 'Cummulative', 'stateDiv');
        plot_time_series_data(state_id, 'Daily', 'dailyStateDiv');
    };
    state_id = $('.state_main_table').attr('id');
    show_state_data(state_id);


    function district_bar_chart(dist_names_bar, dist_confirmed_bar, dist_active_bar, dist_recovered_bar) {
        var trace1 = {
            x: dist_names_bar,
            y: dist_confirmed_bar,
            type: 'bar',
            name: 'Confirmed',
            marker: {
                color: 'rgb(10, 228, 240)',
                opacity: 0.7,
            }
        };

        var trace2 = {
            x: dist_names_bar,
            y: dist_active_bar,
            type: 'bar',
            name: 'Active',
            marker: {
                color: 'rgb(252, 111, 3)',
                opacity: 0.5
            }
        };

        var trace3 = {
            x: dist_names_bar,
            y: dist_recovered_bar,
            type: 'bar',
            name: 'Recovered',
            marker: {
                color: 'rgb(22, 111, 3)',
                opacity: 0.5
            }
        };

        var data = [trace1, trace3, trace2];

        var layout = {
            title: 'District wise Data',
            xaxis: {
                tickangle: -45
            },
            barmode: 'group'
        };

        Plotly.react('districtDiv', data, layout, { displayModeBar: false });

    }
});
